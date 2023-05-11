from django.urls import path
from .views import JMDictSearch

urlpatterns = [
    path('search/', JMDictSearch.as_view()),
]
