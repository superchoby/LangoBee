"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .serializers import CustomJWTSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from django.conf import settings
from users.views import FacebookLogin, GoogleLogin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(serializer_class=CustomJWTSerializer), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('users/', include('users.urls')),
    path('reviews/', include('reviews.urls')),
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('languages/', include('languages.urls')),
    path('stories/', include('stories.urls')),
    path('emails/', include('emails.urls')),
    path('subscriptions/', include('subscriptions.urls')),
    path('subjects/', include('subjects.urls')),
    path('social-login/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('dj-rest-auth/', include('dj_rest_auth.urls')), 
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('social-login/google/', GoogleLogin.as_view(), name='google_login'),
    path("accounts/", include("allauth.urls")),
]

if settings.DEBUG:
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()
