from django.urls import path
from .views import (
    PricesViewNonAuthenticated, 
    PricesViewAuthenticated,
    UserStripeInfo,
    StripeCheckout,
    StripeWebhook,
    SuccessfulCheckoutView,
    UsersSubscriptionInfo,
    UpgradeSubscriptionView,
    CustomerPortalView
)

urlpatterns = [
    path('view_prices_authenticated/', PricesViewAuthenticated.as_view()),
    path('view_prices_nonauthenticated/', PricesViewNonAuthenticated.as_view()),
    path('stripe_info/', UserStripeInfo.as_view()),
    path('create_checkout_session/', StripeCheckout.as_view()),
    path('stripe_webhook/', StripeWebhook.as_view()),
    path('successful_checkout/', SuccessfulCheckoutView.as_view()),
    path('users_info/', UsersSubscriptionInfo.as_view()),
    path('upgrade/', UpgradeSubscriptionView.as_view()),
    path('customer_portal/', CustomerPortalView.as_view()),
]
