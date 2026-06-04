#!/usr/bin/env bash
set -o errexit
export PYTHONPATH=/app
export MISE_PYTHON_GITHUB_ATTESTATIONS=false
mise install
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --noinput
