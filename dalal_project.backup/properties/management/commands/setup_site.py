from django.core.management.base import BaseCommand

from properties.models import SiteSettings


class Command(BaseCommand):
    help = 'Initialize site settings with default Arabic content'

    def handle(self, *args, **options):
        settings, created = SiteSettings.objects.get_or_create(pk=1)
        if created or not settings.about_content:
            settings.about_title = 'من نحن'
            settings.about_content = (
                'دلال منصة عقارات عراقية متخصصة في عرض وإدارة العقارات السكنية والتجارية.\n'
                'نسعى لتقديم تجربة بحث سهلة وآمنة تربط الباحثين عن العقار بالدلالين المحترفين.'
            )
            settings.mission = 'تسهيل الوصول إلى العقار المناسب بأعلى معايير الشفافية والجودة.'
            settings.tagline = 'منصتك الموثوقة للعقارات في العراق'
            settings.meta_description = 'دلال - بحث وشراء وإيجار العقارات في العراق. شقق، بيوت، أراضي، محلات تجارية.'
            settings.save()
            self.stdout.write(self.style.SUCCESS('Site settings initialized.'))
        else:
            self.stdout.write('Site settings already exist.')
