from django.urls import path, include
from .views import StoryListView, ReadStoryView
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('<str:language>/', StoryListView.as_view()),
    path('<str:language>/<slug:slug>/', ReadStoryView.as_view()),
]