from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
class Subscription(models.Model):
    SUBSCRIPTION_TYPES = [
        ('Monthly', 'Monthly'),
        ('Annual', 'Annual'),
        ('Lifetime', 'Lifetime')
    ]

    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE, related_name='subscription')
    subscription_plan = models.CharField(choices=SUBSCRIPTION_TYPES, max_length=max(len(sub_type[0]) for sub_type in SUBSCRIPTION_TYPES))
    stripe_price_id = models.CharField(max_length=50)
    stripe_subscription_id = models.CharField(max_length=100, unique=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[("active", "Active"), ("canceled", "Canceled")])
    stripe_customer_id = models.TextField()
