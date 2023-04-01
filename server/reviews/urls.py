from django.urls import path
from .views import ReviewView, UpdateReviewStatus

urlpatterns = [
    path('', ReviewView.as_view()),
    path('update-card-review-status/', UpdateReviewStatus.as_view()),
]