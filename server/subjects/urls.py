from django.urls import path
from .views import GetUsersSubjectsForLessons

urlpatterns = [
    path('<str:language>/<str:course>/', GetUsersSubjectsForLessons.as_view()),
]
