from django.contrib import admin
from django.utils.html import format_html

from .models import Message, Property, PropertyImage, SiteSettings


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ('image', 'caption', 'sort_order', 'is_primary')


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        'display_title', 'type', 'province', 'city', 'price', 'status',
        'is_featured', 'is_promoted', 'views_count', 'created_at',
    )
    list_filter = ('type', 'status', 'province', 'is_featured', 'is_promoted', 'parking', 'furnished')
    search_fields = ('title', 'location', 'city', 'district', 'description', 'phone', 'slug')
    list_editable = ('is_featured', 'is_promoted')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('views_count', 'created_at', 'updated_at')
    inlines = [PropertyImageInline]
    list_per_page = 25

    fieldsets = (
        ('أساسي', {'fields': ('title', 'slug', 'type', 'status', 'is_featured', 'is_promoted', 'promotion_until')}),
        ('الموقع', {'fields': ('province', 'city', 'district', 'location', 'latitude', 'longitude')}),
        ('التفاصيل', {'fields': ('area', 'price', 'bedrooms', 'bathrooms', 'floors', 'year_built', 'parking', 'furnished')}),
        ('المحتوى', {'fields': ('description', 'phone', 'image')}),
        ('إحصائيات', {'fields': ('views_count', 'created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'property', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'message', 'email', 'phone')
    list_editable = ('is_read',)
    actions = ['mark_read', 'mark_unread']

    @admin.action(description='تعليم كمقروء')
    def mark_read(self, request, queryset):
        queryset.update(is_read=True)

    @admin.action(description='تعليم كغير مقروء')
    def mark_unread(self, request, queryset):
        queryset.update(is_read=False)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'sort_order', 'is_primary', 'preview')
    list_filter = ('is_primary',)

    @admin.display(description='معاينة')
    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" style="border-radius:8px"/>', obj.image.url)
        return '-'
