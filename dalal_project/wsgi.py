"""
WSGI config for dalal_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import sys

# CRITICAL: Remove CSRF_TRUSTED_ORIGINS from environment immediately
# Railway may set this to an invalid value (e.g., ".") that causes Django 4.0+ to fail
# This must happen before Django settings are loaded
if 'CSRF_TRUSTED_ORIGINS' in os.environ:
    del os.environ['CSRF_TRUSTED_ORIGINS']

from django.core.wsgi import get_wsgi_application

# Ensure project root is on sys.path in deployment environments
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
	sys.path.insert(0, project_root)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dalal_project.settings')

application = get_wsgi_application()
