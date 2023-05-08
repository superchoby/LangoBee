"""
Django settings for server project.

Generated by 'django-admin startproject' using Django 4.0.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""
import django_on_heroku
import os
import environ
from pathlib import Path
import stripe

env = environ.Env()
environ.Env.read_env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

IS_IN_PROD_ENVIRON = 'SECRET_KEY' in os.environ

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ['SECRET_KEY'] if IS_IN_PROD_ENVIRON else 'dummy key'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = not IS_IN_PROD_ENVIRON

ALLOWED_HOSTS = [
    'https://japanese-learning-site-server.herokuapp.com',
    'http://127.0.0.1:8000',
    'https://langobee-server.herokuapp.com/',
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Ones I've made
    'users',
    'reviews',
    'streaks',
    'languages',
    'subjects',
    'jmdict',
    'stories',
    'emails',
    'subscriptions',

    # Third Party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_rest_passwordreset',
    'sendgrid',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'server.urls'

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

WSGI_APPLICATION = 'server.wsgi.application'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
    'https://www.langobee.com',
    'https://www.langobee.com',
    "http://localhost:8080",
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = env('CONTACT_LANGOBEE_EMAIL')
EMAIL_HOST_PASSWORD = env('CONTACT_LANGOBEE_PASSWORD')

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'LangoBeeLocal',
            # 'NAME': 'ProdCopy1',
            'PASSWORD': '',
            'HOST': '127.0.0.1',
            'PORT': '5432',
        }
    }

if IS_IN_PROD_ENVIRON:
    # DATABASES = {

    #     'default': {

    #         'ENGINE': 'django.db.backends.postgresql_psycopg2',

    #         'NAME': 'ec2-54-160-96-70.compute-1.amazonaws.com',

    #         'USER': 'hmgrlbxxgaehew',

    #         'PASSWORD': '23d5550e71d7a3c7b30d5c68a49b01322ff5562f8fee0a66495759cc32e6ff84',

    #         'HOST': 'ec2-54-160-96-70.compute-1.amazonaws.com',

    #         'PORT': '5432',

    #     }

    # }
    DATABASES = {
        'default': {

            'ENGINE': 'django.db.backends.postgresql_psycopg2',

            'NAME': os.environ['DATABASE_NAME'],

            'USER': os.environ['DATABASE_USER'],

            'PASSWORD': os.environ['DATABASE_PASSWORD'],

            'HOST': os.environ['DATABASE_HOST'],

            'PORT': '5432',

        }
    }


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.User'

DJANGO_REST_PASSWORDRESET_NO_INFORMATION_LEAKAGE = True

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

django_on_heroku.settings(locals())

STRIPE_TEST_PUBLIC_KEY = env("STRIPE_PUBLIC_KEY")
STRIPE_TEST_SECRET_KEY = env("STRIPE_SECRET_KEY")
STRIPE_LIVE_MODE = IS_IN_PROD_ENVIRON
stripe.api_key = env("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = env("STRIPE_WEBHOOK_SECRET_KEY")

AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
