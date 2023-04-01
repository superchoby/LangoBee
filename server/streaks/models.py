from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

# Create your models here.
class DatesStudied(models.Model):
    expGained = models.PositiveIntegerField(default=0)
    date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(get_user_model(), related_name="dates_studied", on_delete=models.CASCADE)

    class Meta:
        ordering = ['-date']
    