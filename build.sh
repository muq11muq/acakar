#!/usr/bin/env bash
set -o errexit
export PYTHONPATH=/app
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --noinput
