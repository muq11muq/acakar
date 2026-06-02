# دلال — منصة عقارات عراقية (Django)

منصة إنتاجية لعرض وإدارة العقارات مع بحث متقدم، معرض صور، خرائط، ولوحة تحكم للدلال.

## التشغيل المحلي

```bash
cd dalal_project
python -m venv ../venv
..\venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py setup_site
python manage.py createsuperuser
python manage.py runserver
```

افتح: http://127.0.0.1:8000/

## النشر

### Railway / Render

1. اربط المستودع وحدد مجلد `dalal_project`
2. أضف متغيرات البيئة من `.env.example`
3. **Build command:** `bash build.sh` أو `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
4. **Start command:** `gunicorn dalal_project.wsgi:application --bind 0.0.0.0:$PORT`
5. لـ PostgreSQL: أضف `DATABASE_URL` من لوحة الاستضافة و `DB_ENGINE=postgresql`

### PythonAnywhere

1. ارفع المشروع إلى `/home/username/dalal`
2. أنشئ virtualenv وثبّت `requirements.txt`
3. في **Web** → WSGI: `dalal_project.wsgi:application`
4. Static: `/home/username/dalal/staticfiles` → `/static/`
5. Media: `/home/username/dalal/media` → `/media/`

## قاعدة البيانات

| البيئة | الإعداد |
|--------|---------|
| SQLite (تطوير) | `DB_ENGINE=sqlite` (افتراضي) |
| PostgreSQL | `DATABASE_URL=postgres://...` أو `DB_ENGINE=postgresql` |

## المميزات

- واجهة عربية RTL احترافية ومتجاوبة
- بحث وفلترة: محافظة، مدينة، منطقة، نوع، سعر، مساحة، غرف
- عقارات مميزة وإعلانات خاصة
- معرض صور متعدد + خريطة OpenStreetMap
- صفحات: من نحن، تواصل معنا
- أمان: CSRF، XSS headers، rate limiting، SQL عبر ORM
- SEO: sitemap.xml، robots.txt، meta tags
- Logging إلى `logs/dalal.log`

## لوحة الدلال

- `/login/` — دخول staff فقط
- `/dashboard/` — إدارة العقارات والرسائل وإعدادات الموقع
- `/admin/` — إدارة Django
