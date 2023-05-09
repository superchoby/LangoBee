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
    UserSrsLimit,
    DeleteUser,
    SubjectsPerSessionLimit,
    ReminderEmailsView,
    ReminderEmailsThresholdView
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
    path('change-srs-limit/', UserSrsLimit.as_view()),
    path('delete/', DeleteUser.as_view()),
    path('change-subjects-per-session-limit/', SubjectsPerSessionLimit.as_view()),
    path('change-reminder-emails-setting/', ReminderEmailsView.as_view()),
    path('change-reminder-emails-review-threshold-setting/', ReminderEmailsThresholdView.as_view()),
]
