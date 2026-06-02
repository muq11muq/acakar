release: python manage.py migrate --noinput && python manage.py collectstatic --noinput
web: gunicorn realestate_project.wsgi:application --bind 0.0.0.0:$PORT --workers 4 --worker-class sync
