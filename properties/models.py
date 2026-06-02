import os
import uuid

from django.db import models
from django.utils.text import slugify
from django.urls import reverse

from .constants import IRAQ_GOVERNORATES


def property_image_path(instance, filename):
    ext = filename.rsplit('.', 1)[-1].lower()[:10]
    prop_id = getattr(instance, 'property_id', None) or getattr(instance, 'id', None) or 'new'
    name = uuid.uuid4().hex[:10]
    return os.path.join('properties/', f'{prop_id}_{name}.{ext}')


class SiteSettings(models.Model):
    """Singleton site configuration."""
    site_name = models.CharField(max_length=100, default='دلال', verbose_name='اسم الموقع')
    tagline = models.CharField(max_length=200, blank=True, verbose_name='الشعار')
    broker_phone = models.CharField(max_length=30, default='07701234567', verbose_name='هاتف التواصل')
    broker_email = models.EmailField(blank=True, verbose_name='البريد')
    broker_address = models.CharField(max_length=300, blank=True, verbose_name='العنوان')
    whatsapp = models.CharField(max_length=30, blank=True, verbose_name='واتساب')
    about_title = models.CharField(max_length=200, default='من نحن', verbose_name='عنوان من نحن')
    about_content = models.TextField(blank=True, verbose_name='محتوى من نحن')
    mission = models.TextField(blank=True, verbose_name='رسالتنا')
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    meta_description = models.CharField(max_length=300, blank=True, verbose_name='وصف SEO')

    class Meta:
        verbose_name = 'إعدادات الموقع'
        verbose_name_plural = 'إعدادات الموقع'

    def __str__(self):
        return self.site_name

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Property(models.Model):
    PROPERTY_TYPES = [
        ('land', 'قطعة أرض'),
        ('house', 'بيت'),
        ('building', 'بناية'),
        ('apartment', 'شقة'),
        ('store', 'محل تجاري'),
        ('warehouse', 'مستودع'),
    ]

    STATUS_CHOICES = [
        ('ready', 'جاهز'),
        ('under-construction', 'قيد الإنشاء'),
        ('sold', 'مباع'),
        ('rent', 'للإيجار'),
    ]

    title = models.CharField(max_length=200, blank=True, default='', verbose_name='عنوان الإعلان')
    slug = models.SlugField(max_length=220, unique=True, blank=True, default='', allow_unicode=True)
    type = models.CharField(max_length=20, choices=PROPERTY_TYPES, verbose_name='نوع العقار')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ready', verbose_name='الحالة')

    province = models.CharField(max_length=30, choices=IRAQ_GOVERNORATES, default='baghdad', verbose_name='المحافظة')
    city = models.CharField(max_length=100, default='بغداد', verbose_name='المدينة')
    district = models.CharField(max_length=100, blank=True, verbose_name='المنطقة')
    location = models.CharField(max_length=200, verbose_name='العنوان التفصيلي')

    area = models.PositiveIntegerField(verbose_name='المساحة (م²)')
    price = models.BigIntegerField(verbose_name='السعر (د.ع)')
    description = models.TextField(verbose_name='وصف العقار')
    phone = models.CharField(max_length=20, verbose_name='رقم التواصل')

    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='عدد الغرف')
    bathrooms = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='عدد الحمامات')
    floors = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='عدد الطوابق')
    year_built = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='سنة البناء')
    parking = models.BooleanField(default=False, verbose_name='موقف سيارة')
    furnished = models.BooleanField(default=False, verbose_name='مفروش')

    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name='خط العرض')
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name='خط الطول')

    image = models.ImageField(upload_to=property_image_path, null=True, blank=True, verbose_name='الصورة الرئيسية')
    images = models.TextField(blank=True, help_text='روابط صور إضافية (قديم)')

    is_featured = models.BooleanField(default=False, verbose_name='عقار مميز')
    is_promoted = models.BooleanField(default=False, verbose_name='إعلان خاص')
    promotion_until = models.DateField(null=True, blank=True, verbose_name='انتهاء الترويج')

    views_count = models.PositiveIntegerField(default=0, verbose_name='عدد المشاهدات')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'عقار'
        verbose_name_plural = 'العقارات'
        ordering = ['-is_featured', '-is_promoted', '-created_at']
        indexes = [
            models.Index(fields=['province', 'city']),
            models.Index(fields=['type', 'status']),
            models.Index(fields=['price']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_featured', 'is_promoted']),
        ]

    def __str__(self):
        return self.display_title

    @property
    def display_title(self):
        if self.title:
            return self.title
        return f'{self.get_type_display()} - {self.city}'

    @property
    def full_location(self):
        parts = [self.get_province_display(), self.city]
        if self.district:
            parts.append(self.district)
        parts.append(self.location)
        return '، '.join(p for p in parts if p)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        if not self.city and self.location:
            self.city = self.location[:100]
        if not self.title:
            self.title = f'{self.get_type_display()} - {self.city}'
        super().save(*args, **kwargs)
        if is_new or not self.slug:
            base = slugify(f'{self.title}-{self.city}-{self.pk}', allow_unicode=True)
            if not base:
                base = f'property-{self.pk}'
            slug = base
            counter = 1
            while Property.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{counter}'
                counter += 1
            Property.objects.filter(pk=self.pk).update(slug=slug)
            self.slug = slug

    def get_absolute_url(self):
        return reverse('property_detail', kwargs={'slug': self.slug})

    def get_all_images(self):
        urls = []
        for img in self.gallery_images.all():
            if img.image:
                urls.append(img.image.url)
        if self.image and self.image.url not in urls:
            urls.insert(0, self.image.url)
        if self.images:
            for url in self.images.split(','):
                url = url.strip()
                if url and url not in urls:
                    urls.append(url)
        return urls or ['/static/img/placeholder-property.svg']

    def get_main_image(self):
        imgs = self.get_all_images()
        return imgs[0] if imgs else None

    def increment_views(self):
        Property.objects.filter(pk=self.pk).update(views_count=models.F('views_count') + 1)
        self.refresh_from_db(fields=['views_count'])

    def has_map(self):
        return self.latitude is not None and self.longitude is not None

    @property
    def price_formatted(self):
        return f'{self.price:,}'


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name='gallery_images', verbose_name='العقار'
    )
    image = models.ImageField(upload_to=property_image_path, verbose_name='الصورة')
    caption = models.CharField(max_length=200, blank=True, verbose_name='تعليق')
    sort_order = models.PositiveSmallIntegerField(default=0, verbose_name='الترتيب')
    is_primary = models.BooleanField(default=False, verbose_name='رئيسية')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'صورة عقار'
        verbose_name_plural = 'صور العقارات'
        ordering = ['sort_order', 'id']

    def __str__(self):
        return f'صورة {self.property_id} #{self.pk}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_primary and self.image:
            prop = self.property
            prop.image = self.image
            prop.save(update_fields=['image'])


class Message(models.Model):
    name = models.CharField(max_length=100, verbose_name='الاسم')
    email = models.EmailField(blank=True, verbose_name='البريد الإلكتروني')
    phone = models.CharField(max_length=20, blank=True, verbose_name='رقم الهاتف')
    message = models.TextField(verbose_name='الرسالة')
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, null=True, blank=True, related_name='inquiries'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'رسالة'
        verbose_name_plural = 'الرسائل'
        ordering = ['-created_at']

    def __str__(self):
        return f'رسالة من {self.name}'
