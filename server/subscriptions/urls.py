from django.urls import path
from .views import (
    PricesView,
    UserStripeInfo,
    StripeCheckout,
    StripeWebhook,
    SuccessfulCheckoutView,
    UsersSubscriptionInfo,
    UpgradeSubscriptionView
)

urlpatterns = [
    path('view_prices/', PricesView.as_view()),
    path('stripe_info/', UserStripeInfo.as_view()),
    path('create_checkout_session/', StripeCheckout.as_view()),
    path('stripe_webhook/', StripeWebhook.as_view()),
    path('successful_checkout/', SuccessfulCheckoutView.as_view()),
    path('users_info/', UsersSubscriptionInfo.as_view()),
    path('upgrade/', UpgradeSubscriptionView.as_view())
]

