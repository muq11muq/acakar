from django.db.models import Q

from .models import Property


PUBLIC_STATUSES = ['ready', 'under-construction', 'rent']


def get_public_properties():
    return Property.objects.filter(status__in=PUBLIC_STATUSES).select_related().prefetch_related('gallery_images')


def filter_properties(queryset, params):
    """Apply search filters from GET params dict."""
    q = params.get('q', '').strip()
    if q:
        queryset = queryset.filter(
            Q(title__icontains=q)
            | Q(location__icontains=q)
            | Q(city__icontains=q)
            | Q(district__icontains=q)
            | Q(description__icontains=q)
        )

    province = params.get('province')
    if province:
        queryset = queryset.filter(province=province)

    city = params.get('city', '').strip()
    if city:
        queryset = queryset.filter(city__icontains=city)

    district = params.get('district', '').strip()
    if district:
        queryset = queryset.filter(district__icontains=district)

    ptype = params.get('type')
    if ptype:
        queryset = queryset.filter(type=ptype)

    status = params.get('status')
    if status:
        queryset = queryset.filter(status=status)

    price_min = params.get('price_min')
    if price_min:
        try:
            queryset = queryset.filter(price__gte=int(price_min))
        except (TypeError, ValueError):
            pass

    price_max = params.get('price_max')
    if price_max:
        try:
            queryset = queryset.filter(price__lte=int(price_max))
        except (TypeError, ValueError):
            pass

    area_min = params.get('area_min')
    if area_min:
        try:
            queryset = queryset.filter(area__gte=int(area_min))
        except (TypeError, ValueError):
            pass

    area_max = params.get('area_max')
    if area_max:
        try:
            queryset = queryset.filter(area__lte=int(area_max))
        except (TypeError, ValueError):
            pass

    bedrooms = params.get('bedrooms')
    if bedrooms:
        try:
            queryset = queryset.filter(bedrooms__gte=int(bedrooms))
        except (TypeError, ValueError):
            pass

    if params.get('has_parking'):
        queryset = queryset.filter(parking=True)
    if params.get('furnished'):
        queryset = queryset.filter(furnished=True)
    if params.get('featured') in ('1', 'true', 'on'):
        queryset = queryset.filter(is_featured=True)

    return queryset


def sort_properties(queryset, sort_key):
    mapping = {
        'newest': ['-created_at'],
        'price_asc': ['price'],
        'price_desc': ['-price'],
        'area_asc': ['area'],
        'area_desc': ['-area'],
        'views': ['-views_count'],
    }
    return queryset.order_by(*mapping.get(sort_key, ['-is_featured', '-is_promoted', '-created_at']))


def save_gallery_images(property_obj, files):
    """Save multiple uploaded images to PropertyImage."""
    if not files:
        return
    start_order = property_obj.gallery_images.count()
    for i, f in enumerate(files):
        if not f or not getattr(f, 'name', None):
            continue
        ctype = getattr(f, 'content_type', '') or ''
        if ctype and not ctype.startswith('image/'):
            continue
        PropertyImage.objects.create(
            property=property_obj,
            image=f,
            sort_order=start_order + i,
            is_primary=(start_order == 0 and i == 0 and not property_obj.image),
        )
