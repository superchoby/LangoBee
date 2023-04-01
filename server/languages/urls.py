from django.urls import path
from .views import (
    GetLevelsForLanguagesCourse,
    GetUsersSubjectsForLessons,
    ArticleView,
    MarkArticleAsReadView
)

urlpatterns = [
    path('levels_for_course/<str:language>/<str:course>/', GetLevelsForLanguagesCourse.as_view()),
    path('lesson_session/<str:language>/<str:course>/', GetUsersSubjectsForLessons.as_view()),
    path('article/<str:language>/<slug:slug>/', ArticleView.as_view()),
    path('article/mark_as_read/<str:language>/<slug:slug>/', MarkArticleAsReadView.as_view()),
]
