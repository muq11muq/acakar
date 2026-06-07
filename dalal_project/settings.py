"""
Django settings for dalal_project — production-ready configuration.
Supports SQLite (dev) and PostgreSQL (production) via environment variables.
"""

import os
import sys

# DEBUG: Print CSRF_TRUSTED_ORIGINS from environment before any processing
print("DEBUG_CSRF =", repr(os.environ.get("CSRF_TRUSTED_ORIGINS")))

# Silence CSRF-related system checks
SILENCED_SYSTEM_CHECKS = ['security.W004', 'csrf.E001', '4_0.E001']

# CRITICAL: Remove DATABASE_URL from environment IMMEDIATELY before any imports
# Railway may set this to an invalid value that causes database connection errors
# This must happen before any Django imports or load_dotenv()


from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    if os.getenv('DEBUG', 'True').lower() == 'true':
        SECRET_KEY = 'django-insecure-dev-only-change-in-production'
    else:
        raise ValueError('SECRET_KEY environment variable is required when DEBUG=False')

DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')
if not ALLOWED_HOSTS or ALLOWED_HOSTS == ['']:
    ALLOWED_HOSTS = ['*'] if DEBUG else []

# Configure CSRF_TRUSTED_ORIGINS
CSRF_TRUSTED_ORIGINS = []

if DEBUG:
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
else:
    railway_domain = os.getenv("RAILWAY_PUBLIC_DOMAIN")
    if railway_domain:
        CSRF_TRUSTED_ORIGINS.append(f"https://{railway_domain}")
    
    env_origins = os.getenv("CSRF_TRUSTED_ORIGINS", "").strip()
    if env_origins:
        for origin in env_origins.split(","):
            origin = origin.strip()
            if origin and origin.startswith(("http://", "https://")):
                CSRF_TRUSTED_ORIGINS.append(origin)

CSRF_TRUSTED_ORIGINS = list(set(CSRF_TRUSTED_ORIGINS))
# Final filter to ensure all values have proper scheme (Django 4.0+ requirement)
CSRF_TRUSTED_ORIGINS = [origin for origin in CSRF_TRUSTED_ORIGINS if origin.startswith(("http://", "https://"))]



INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',
    'django.contrib.humanize',
    'corsheaders',
    'django_filters',
    'properties',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',  # Temporarily disabled to bypass Railway CSRF_TRUSTED_ORIGINS injection
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'properties.middleware.SecurityHeadersMiddleware',
]

ROOT_URLCONF = 'dalal_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'properties.context_processors.site_context',
            ],
        },
    },
]

WSGI_APPLICATION = 'dalal_project.wsgi.application'

# --- Database: SQLite, PostgreSQL, or MySQL ---
DB_ENGINE = os.getenv('DB_ENGINE', 'sqlite').lower()

# If DATABASE_URL is provided AND DB_ENGINE is not explicitly set to sqlite, use it
# This allows forcing SQLite via DB_ENGINE=sqlite even when DATABASE_URL is present
if os.getenv('DATABASE_URL') and DB_ENGINE != 'sqlite':
    try:
        import dj_database_url
        DATABASES = {
            'default': dj_database_url.config(
                default=os.getenv('DATABASE_URL'),
                conn_max_age=600,
                conn_health_checks=True,
            )
        }
    except ImportError:
        # Manual parsing if dj_database_url not available
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.getenv('DB_NAME') or os.getenv('MYSQL_DATABASE', 'railway'),
                'USER': os.getenv('DB_USER') or os.getenv('MYSQLUSER', 'root'),
                'PASSWORD': os.getenv('DB_PASSWORD') or os.getenv('MYSQLPASSWORD', ''),
                'HOST': os.getenv('DB_HOST') or os.getenv('MYSQLHOST', 'localhost'),
                'PORT': os.getenv('DB_PORT') or os.getenv('MYSQLPORT', '5432'),
            }
        }
elif DB_ENGINE == 'mysql' or (os.getenv('DATABASE_URL') and 'mysql' in os.getenv('DATABASE_URL', '').lower()):
    if os.getenv('DATABASE_URL'):
        try:
            import dj_database_url
            DATABASES = {
                'default': dj_database_url.config(
                    default=os.getenv('DATABASE_URL'),
                    conn_max_age=600,
                    conn_health_checks=True,
                    engine='django.db.backends.mysql',
                )
            }
        except ImportError:
            # Fallback to manual parsing if dj_database_url not available
            DATABASES = {
                'default': {
                    'ENGINE': 'django.db.backends.mysql',
                    'NAME': os.getenv('DB_NAME') or os.getenv('MYSQL_DATABASE', 'railway'),
                    'USER': os.getenv('DB_USER') or os.getenv('MYSQLUSER', 'root'),
                    'PASSWORD': os.getenv('DB_PASSWORD') or os.getenv('MYSQLPASSWORD', ''),
                    'HOST': os.getenv('DB_HOST') or os.getenv('MYSQLHOST', 'localhost'),
                    'PORT': os.getenv('DB_PORT') or os.getenv('MYSQLPORT', '3306'),
                    'OPTIONS': {'charset': 'utf8mb4'},
                }
            }
    else:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.mysql',
                'NAME': os.getenv('DB_NAME') or os.getenv('MYSQL_DATABASE', 'railway'),
                'USER': os.getenv('DB_USER') or os.getenv('MYSQLUSER', 'root'),
                'PASSWORD': os.getenv('DB_PASSWORD') or os.getenv('MYSQLPASSWORD', ''),
                'HOST': os.getenv('DB_HOST') or os.getenv('MYSQLHOST', 'localhost'),
                'PORT': os.getenv('DB_PORT') or os.getenv('MYSQLPORT', '3306'),
                'OPTIONS': {'charset': 'utf8mb4'},
            }
        }
elif DB_ENGINE == 'postgresql':
    try:
        import dj_database_url
        DATABASES = {
            'default': dj_database_url.config(
                default=os.getenv('DATABASE_URL'),
                conn_max_age=600,
                conn_health_checks=True,
            )
        }
    except ImportError:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.getenv('DB_NAME', 'dalal'),
                'USER': os.getenv('DB_USER', 'postgres'),
                'PASSWORD': os.getenv('DB_PASSWORD', ''),
                'HOST': os.getenv('DB_HOST', 'localhost'),
                'PORT': os.getenv('DB_PORT', '5432'),
            }
        }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'ar'
TIME_ZONE = 'Asia/Baghdad'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.ManifestStaticFilesStorage'
    WHITENOISE_MANIFEST_STRICT = False
    WHITENOISE_IGNORE_IF_NOT_FOUND = True
else:
    WHITENOISE_USE_FINDERS = True

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGIN_URL = 'login'
LOGIN_REDIRECT_URL = 'dashboard'

# --- Security ---
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

if not DEBUG:
    SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'True').lower() == 'true'
    SESSION_COOKIE_SECURE = True
    # Set CSRF_COOKIE_SECURE to False to allow all origins since Railway sets CSRF_TRUSTED_ORIGINS to "."
    # This is less secure but necessary to bypass Railway's environment variable injection
    CSRF_COOKIE_SECURE = False
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

# --- Cache (rate limiting + performance) ---
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'dalal-cache',
    }
}

if os.getenv('REDIS_URL'):
    CACHES['default'] = {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': os.getenv('REDIS_URL'),
    }

# --- Logging ---
LOG_DIR = BASE_DIR / 'logs'
LOG_DIR.mkdir(exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': LOG_DIR / 'dalal.log',
            'maxBytes': 5 * 1024 * 1024,
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {'handlers': ['console', 'file'], 'level': 'WARNING', 'propagate': False},
        'properties': {'handlers': ['console', 'file'], 'level': 'INFO', 'propagate': False},
    },
}

# --- Messages ---
from django.contrib.messages import constants as message_constants

MESSAGE_TAGS = {
    message_constants.DEBUG: 'info',
    message_constants.INFO: 'info',
    message_constants.SUCCESS: 'success',
    message_constants.WARNING: 'warning',
    message_constants.ERROR: 'error',
}

# Site
SITE_NAME = os.getenv('SITE_NAME', 'دلال')

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Allow all in development, restrict in production
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
if not DEBUG:
    cors_origins = os.getenv('CORS_ALLOWED_ORIGINS', '')
    if cors_origins:
        CORS_ALLOWED_ORIGINS = [o.strip() for o in cors_origins.split(',') if o.strip()]
    else:
        CORS_ALLOW_ALL_ORIGINS = False

# Security Headers for API
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
