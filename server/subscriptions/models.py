from django.db import models

# Create your models here.
class Subscription(models.Model):
    SUBSCRIPTION_TYPES = [
        ('Monthly', 'Monthly'),
        ('Annual', 'Annual'),
        ('Lifetime', 'Lifetime')
    ]

    subscription_plan = models.CharField(choices=SUBSCRIPTION_TYPES, max_length=max(len(sub_type[0]) for sub_type in SUBSCRIPTION_TYPES))
    stripe_price_id = models.CharField(max_length=50)
    stripe_subscription_id = models.CharField(max_length=100, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[("active", "Active"), ("canceled", "Canceled")])
    stripe_customer_id = models.TextField()
