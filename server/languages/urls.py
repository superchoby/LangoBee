from django.urls import path
from .views import (
    GetLevelsForLanguagesCourse,
    GetUsersSubjectsForLessons,
    SpecificArticleView,
    MarkArticleAsReadView,
    GetRemainingSubjectsForLevel,
    TestToSkipCoursesLevelsView,
    GeneralArticleView
)

urlpatterns = [
    path('levels_for_course/<str:language>/<str:course>/', GetLevelsForLanguagesCourse.as_view()),
    path('levels_for_course/current_remaining_subjects_for_level/<str:language>/<str:course>/', GetRemainingSubjectsForLevel.as_view()),
    path('lesson_session/<str:language>/<str:course>/', GetUsersSubjectsForLessons.as_view()),
    path('article/<str:language>/<slug:slug>/', SpecificArticleView.as_view()),
    path('article/mark_as_read/<str:language>/<slug:slug>/', MarkArticleAsReadView.as_view()),
    path('article/', GeneralArticleView.as_view()),
    path('tests_to_skip_courses_levels/<str:tests_slug>/', TestToSkipCoursesLevelsView.as_view()),
]
