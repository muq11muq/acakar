import json

from .constants import GOVERNORATE_CITIES, IRAQ_GOVERNORATES
from .models import SiteSettings


def site_context(request):
    settings = SiteSettings.get_solo()
    return {
        'site_settings': settings,
        'governorates': IRAQ_GOVERNORATES,
        'governorate_cities_json': json.dumps(GOVERNORATE_CITIES, ensure_ascii=False),
    }
