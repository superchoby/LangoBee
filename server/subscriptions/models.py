from django.db import models
from django.utils import timezone

# Create your models here.
class Subscription(models.Model):
    SUBSCRIPTION_TYPES = [
        ('Monthly', 'Monthly'),
        ('Annual', 'Annual'),
        ('Lifetime', 'Lifetime')
    ]

    subscription_plan = models.CharField(choices=SUBSCRIPTION_TYPES, max_length=max(len(sub_type[0]) for sub_type in SUBSCRIPTION_TYPES), null=True)
    stripe_price_id = models.CharField(max_length=50, null=True)
    stripe_subscription_id = models.CharField(max_length=100, null=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    