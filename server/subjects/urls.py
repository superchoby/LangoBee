from django.urls import path
from .views import DictionarySearch

urlpatterns = [
    path('search/', DictionarySearch.as_view()),
]
