from django.urls import path
from .views import (
    DictionarySearch,
    AddDictionaryEntryToReviewView
)

urlpatterns = [
    path('search/', DictionarySearch.as_view()),
    path('add_dictionary_entry_to_review/', AddDictionaryEntryToReviewView.as_view())
]
