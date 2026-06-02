from django import forms
from django.core.validators import MinValueValidator

from .constants import IRAQ_GOVERNORATES, GOVERNORATE_CITIES
from .models import Property, Message, SiteSettings, PropertyImage


def _fc(placeholder=''):
    attrs = {'class': 'form-control'}
    if placeholder:
        attrs['placeholder'] = placeholder
    return attrs


class PropertySearchForm(forms.Form):
    q = forms.CharField(required=False, label='بحث', widget=forms.TextInput(attrs=_fc('ابحث عن عقار...')))
    province = forms.ChoiceField(
        required=False, label='المحافظة',
        choices=[('', 'كل المحافظات')] + list(IRAQ_GOVERNORATES),
        widget=forms.Select(attrs={'class': 'form-control', 'id': 'id_province'}),
    )
    city = forms.CharField(required=False, label='المدينة', widget=forms.TextInput(attrs={
        **{k: v for k, v in _fc('المدينة').items()}, 'list': 'city-list', 'id': 'id_city',
    }))
    district = forms.CharField(required=False, label='المنطقة', widget=forms.TextInput(attrs=_fc('المنطقة')))
    type = forms.ChoiceField(required=False, label='نوع العقار', choices=[('', 'كل الأنواع')])
    status = forms.ChoiceField(required=False, label='الحالة', choices=[('', 'كل الحالات')])
    price_min = forms.IntegerField(required=False, label='السعر من', validators=[MinValueValidator(0)])
    price_max = forms.IntegerField(required=False, label='السعر إلى', validators=[MinValueValidator(0)])
    area_min = forms.IntegerField(required=False, label='المساحة من', validators=[MinValueValidator(0)])
    area_max = forms.IntegerField(required=False, label='المساحة إلى', validators=[MinValueValidator(0)])
    bedrooms = forms.IntegerField(required=False, label='الغرف', validators=[MinValueValidator(0)])
    sort = forms.ChoiceField(required=False, label='ترتيب')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['type'].choices = [('', 'كل الأنواع')] + list(Property.PROPERTY_TYPES)
        self.fields['status'].choices = [('', 'كل الحالات')] + list(Property.STATUS_CHOICES)
        from .constants import SORT_CHOICES
        self.fields['sort'].choices = SORT_CHOICES
        for name, field in self.fields.items():
            if 'class' not in field.widget.attrs:
                field.widget.attrs['class'] = 'form-control'


class PropertyForm(forms.ModelForm):
    class Meta:
        model = Property
        fields = [
            'title', 'type', 'status', 'province', 'city', 'district', 'location',
            'area', 'price', 'description', 'phone', 'bedrooms', 'bathrooms', 'floors',
            'year_built', 'parking', 'furnished', 'latitude', 'longitude',
            'is_featured', 'is_promoted', 'image',
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 5, 'class': 'form-control'}),
            'location': forms.TextInput(attrs={'placeholder': 'الحي، الشارع، أقرب معلم', 'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            if 'class' not in field.widget.attrs:
                field.widget.attrs['class'] = 'form-control'


class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ['name', 'email', 'phone', 'message']
        widgets = {
            'message': forms.Textarea(attrs={'rows': 4, 'placeholder': 'اكتب رسالتك...', 'class': 'form-control'}),
            'name': forms.TextInput(attrs={'placeholder': 'الاسم الكامل', 'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'placeholder': 'example@email.com', 'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'placeholder': '07XXXXXXXXX', 'class': 'form-control'}),
        }


class SiteSettingsForm(forms.ModelForm):
    class Meta:
        model = SiteSettings
        fields = [
            'site_name', 'tagline', 'broker_phone', 'broker_email', 'broker_address',
            'whatsapp', 'mission', 'meta_description',
            'facebook_url', 'instagram_url',
        ]
        widgets = {
            'mission': forms.Textarea(attrs={'rows': 4}),
            'meta_description': forms.Textarea(attrs={'rows': 2}),
        }
