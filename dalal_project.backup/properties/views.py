import logging

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods, require_POST

from .constants import GOVERNORATE_CITIES
from .decorators import rate_limit
from .forms import MessageForm, PropertyForm, PropertySearchForm, SiteSettingsForm
from .models import Message, Property, PropertyImage, SiteSettings
from .utils import filter_properties, get_public_properties, save_gallery_images, sort_properties

logger = logging.getLogger('properties')

staff_required = user_passes_test(lambda u: u.is_authenticated and u.is_staff)


def home(request):
    form = PropertySearchForm(request.GET or None)
    queryset = get_public_properties()

    if form.is_valid():
        cd = form.cleaned_data
        params = request.GET.dict()
        for k, v in cd.items():
            if v not in (None, ''):
                params[k] = v
        queryset = filter_properties(queryset, params)
        sort_key = cd.get('sort') or request.GET.get('sort', 'newest')
    else:
        queryset = filter_properties(queryset, request.GET.dict())
        sort_key = request.GET.get('sort', 'newest')

    queryset = sort_properties(queryset, sort_key)
    featured = get_public_properties().filter(is_featured=True)[:6]
    promoted = get_public_properties().filter(is_promoted=True)[:4]

    paginator = Paginator(queryset, 9)
    page_obj = paginator.get_page(request.GET.get('page'))

    params = request.GET.copy()
    params.pop('page', None)
    query_string = params.urlencode()

    return render(request, 'properties/home.html', {
        'form': form,
        'properties': page_obj,
        'page_obj': page_obj,
        'featured_properties': featured,
        'promoted_properties': promoted,
        'sort': sort_key,
        'query_string': query_string,
    })


def property_detail(request, slug):
    property_obj = get_object_or_404(Property, slug=slug)
    if property_obj.status not in ['ready', 'under-construction', 'rent'] and not request.user.is_staff:
        messages.warning(request, 'هذا العقار غير متاح حالياً.')
        return redirect('home')

    property_obj.increment_views()
    images = property_obj.get_all_images()

    related = get_public_properties().filter(
        Q(province=property_obj.province) | Q(type=property_obj.type)
    ).exclude(pk=property_obj.pk)[:4]

    message_form = MessageForm()
    return render(request, 'properties/property_detail.html', {
        'property': property_obj,
        'images': images,
        'related_properties': related,
        'message_form': message_form,
    })


def property_detail_legacy(request, property_id):
    prop = get_object_or_404(Property, pk=property_id)
    return redirect(prop.get_absolute_url(), permanent=True)


def about_page(request):
    settings = SiteSettings.get_solo()
    return render(request, 'properties/about.html', {
        'settings': settings,
        'total_properties': get_public_properties().count(),
    })


def contact_page(request):
    settings = SiteSettings.get_solo()
    form = MessageForm()
    return render(request, 'properties/contact.html', {
        'settings': settings,
        'form': form,
    })


@rate_limit('login', limit=5, period=300)
def login_view(request):
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('dashboard')
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_staff:
            login(request, user)
            messages.success(request, 'مرحباً بك في لوحة التحكم')
            return redirect('dashboard')
        messages.error(request, 'بيانات الدخول غير صحيحة أو ليس لديك صلاحية.')
        logger.warning('Failed login attempt for user: %s', username)
    return render(request, 'properties/login.html')


def logout_view(request):
    logout(request)
    messages.info(request, 'تم تسجيل الخروج بنجاح')
    return redirect('home')


@login_required
@staff_required
def dashboard(request):
    properties = Property.objects.prefetch_related('gallery_images').all()
    unread = Message.objects.filter(is_read=False).select_related('property')[:20]
    settings = SiteSettings.get_solo()
    settings_form = SiteSettingsForm(instance=settings)
    property_form = PropertyForm()

    stats = {
        'total': properties.count(),
        'featured': properties.filter(is_featured=True).count(),
        'unread_messages': Message.objects.filter(is_read=False).count(),
    }

    return render(request, 'properties/dashboard.html', {
        'properties': properties,
        'messages_list': unread,
        'settings_form': settings_form,
        'property_form': property_form,
        'stats': stats,
    })


@login_required
@staff_required
@require_POST
def update_site_settings(request):
    settings = SiteSettings.get_solo()
    form = SiteSettingsForm(request.POST, instance=settings)
    if form.is_valid():
        form.save()
        messages.success(request, 'تم حفظ إعدادات الموقع')
    else:
        messages.error(request, 'تحقق من الحقول المدخلة')
    return redirect('dashboard')


@login_required
@staff_required
@require_POST
def add_property(request):
    form = PropertyForm(request.POST, request.FILES)
    if form.is_valid():
        prop = form.save()
        save_gallery_images(prop, request.FILES.getlist('gallery_images'))
        messages.success(request, f'تم نشر العقار: {prop.display_title}')
        return redirect('dashboard')
    messages.error(request, 'يرجى تصحيح الأخطاء في النموذج')
    for field, errs in form.errors.items():
        for e in errs:
            messages.error(request, f'{field}: {e}')
    return redirect('dashboard')


@login_required
@staff_required
def edit_property(request, property_id):
    prop = get_object_or_404(Property, pk=property_id)
    if request.method == 'POST':
        form = PropertyForm(request.POST, request.FILES, instance=prop)
        if form.is_valid():
            form.save()
            save_gallery_images(prop, request.FILES.getlist('gallery_images'))
            messages.success(request, 'تم تحديث العقار')
            return redirect('dashboard')
        return render(request, 'properties/edit_property.html', {
            'property': prop, 'form': form,
        })
    return render(request, 'properties/edit_property.html', {
        'property': prop, 'form': PropertyForm(instance=prop),
    })


@login_required
@staff_required
@require_POST
def delete_property(request, property_id):
    prop = get_object_or_404(Property, pk=property_id)
    title = prop.display_title
    prop.delete()
    messages.success(request, f'تم حذف العقار: {title}')
    return redirect('dashboard')


@login_required
@staff_required
@require_POST
def delete_property_image(request, image_id):
    img = get_object_or_404(PropertyImage, pk=image_id)
    prop_id = img.property_id
    img.delete()
    messages.success(request, 'تم حذف الصورة')
    return redirect('edit_property', property_id=prop_id)


@rate_limit('message', limit=5, period=300)
@require_http_methods(['POST'])
def send_message(request):
    form = MessageForm(request.POST)
    property_id = request.POST.get('property_id')
    prop = None
    if property_id:
        prop = get_object_or_404(Property, pk=property_id)

    if form.is_valid():
        msg = form.save(commit=False)
        msg.property = prop
        msg.save()
        messages.success(request, 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.')
        logger.info('New message from %s', msg.name)
        if prop:
            return redirect(prop.get_absolute_url())
        return redirect('contact')
    messages.error(request, 'يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح')
    if prop:
        return redirect(prop.get_absolute_url())
    return redirect('contact')


@login_required
@staff_required
@require_POST
def mark_message_read(request, message_id):
    msg = get_object_or_404(Message, pk=message_id)
    msg.is_read = True
    msg.save(update_fields=['is_read'])
    return redirect('dashboard')
