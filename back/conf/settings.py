import os
import sys

DEBUG = True
IGNORABLE_404_URLS = [r'^favicon\.ico$']
ROOT_URLCONF = 'conf.urls'
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'core',
    'django_nextjs.apps.DjangoNextJSConfig',
    'drf_spectacular',
    'drf_spectacular_sidecar',
    'rest_framework.authtoken'
]
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
AUTH_USER_MODEL = 'core.User'
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": "db.sqlite3",
    }
}


REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": 'drf_spectacular.openapi.AutoSchema'
}

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "*").split(",")

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "secret-key")

USE_NEXTJS_PROXY_ROUTES = (os.environ.get(
    "USE_NEXTJS_PROXY_ROUTES", "true").lower() in ('true', '1', 't'))


STATIC_ROOT = "static/"
STATIC_URL = 'static/'

NEXTJS_HOST_URL = os.environ.get(
    "NEXTJS_HOST_URL", "http://host.docker.internal:3000")

NEXTJS_SETTINGS = {
    "nextjs_server_url": NEXTJS_HOST_URL
}

SESSION_EXPIRE_AT_BROWSER_CLOSE = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


SPECTACULAR_SETTINGS = {
    'TITLE': 'API docs',
    'DESCRIPTION': 'API docs',
    'EXTENSIONS_INFO': {},
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SERVE_PUBLIC': True,
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
    'SERVE_INCLUDE_SCHEMA': False,
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": False,
        "persistAuthorization": False,
        "displayOperationId": False,
    },
    # "PREPROCESSING_HOOKS": [""],
    # 'SERVE_PERMISSIONS': ['rest_framework.permissions.IsAuthenticated'],
    "REDOC_UI_SETTINGS": {
        "hideDownloadButton": True,
    },
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

JAZZMIN_SETTINGS = {
    "site_title": "Tiny Django",
    "site_header": "Tiny Django",
    "site_brand": "Tiny Django",
    "site_logo": "",
    "login_logo": None,
    "login_logo_dark": None,
    "site_logo_classes": "img-circle",
    "site_icon": None,
    "welcome_sign": "Waddup greetings fellow admin :)",
    "copyright": "Tim Schupp, Tim Benjamin Software UG",
    "search_model": ["auth.User", "auth.Group"],
    "user_avatar": None,
    "topmenu_links": [
        {"name": "Home",  "url": "/app",
            "permissions": ["auth.view_user"]},
    ],
    "usermenu_links": [
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "custom_links": {},
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
    },
    "default_icon_children": "fas fa-circle",
    "related_modal_active": False,
    "custom_css": None,
    "custom_js": None,
    "use_google_fonts_cdn": True,  # TODO: we don't want his
    "show_ui_builder": False,
}

JAZZMIN_UI_TWEAKS = {
    "sidebar_nav_compact_style": True,
}
