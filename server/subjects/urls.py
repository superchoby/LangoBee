from django.urls import path
from .views import (
    DictionarySearch,
    AddDictionaryEntryToReviewView,
    CharacterStrokeDataView,
    KanjiByJLPTView
)

urlpatterns = [
    path('search/', DictionarySearch.as_view()),
    path('add_dictionary_entry_to_review/', AddDictionaryEntryToReviewView.as_view()),
    path('character_stroke_data/<str:char_type>/<str:char>/', CharacterStrokeDataView.as_view()),
    path('get_kanji_by_jlpt/', KanjiByJLPTView.as_view())
]
