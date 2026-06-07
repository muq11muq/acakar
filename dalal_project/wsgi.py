"""
WSGI config for dalal_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import sys

# CRITICAL: Remove Railway's invalid CSRF_TRUSTED_ORIGINS and set valid value
# Railway sets CSRF_TRUSTED_ORIGINS="." which fails Django 4.0+ scheme requirement
if 'CSRF_TRUSTED_ORIGINS' in os.environ:
    del os.environ['CSRF_TRUSTED_ORIGINS']
# Set to valid value to prevent Railway from overriding with "."
os.environ['CSRF_TRUSTED_ORIGINS'] = 'https://acakar-production.up.railway.app'

from django.core.wsgi import get_wsgi_application

# Ensure project root is on sys.path in deployment environments
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
	sys.path.insert(0, project_root)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dalal_project.settings')

application = get_wsgi_application()
