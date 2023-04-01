from django.urls import path
from .views import (
    CreateUserView, 
    UserLessonInfoView, 
    UserHomepageView, 
    ViewedLessonIntro,
    UserUploadPfp,
    UpdateExperiencePoints,
    GetUsersStats,
    UserSrsView,
    UserSrsLimit
)

urlpatterns = [
    path('sign-up/', CreateUserView.as_view()),
    path('homepage/', UserHomepageView.as_view()),
    path('user-lesson/', UserLessonInfoView.as_view()),
    path('viewed-lesson-intro/', ViewedLessonIntro.as_view()),
    path('get-users-stats/', GetUsersStats.as_view()),
    path('upload-pfp/', UserUploadPfp.as_view()),
    path('update-exp-points/', UpdateExperiencePoints.as_view()),
    path('srs-info/', UserSrsView.as_view()),
    path('change-srs-limit/', UserSrsLimit.as_view())
]
