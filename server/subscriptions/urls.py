from django.urls import path
from .views import (
    ProductsView
)

urlpatterns = [
    path('view_products/', ProductsView.as_view()),
]
