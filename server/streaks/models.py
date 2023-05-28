from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

# Create your models here.
class DatesStudied(models.Model):
    expGained = models.PositiveIntegerField(default=0)
    date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='dates_studied')

    class Meta:
        ordering = ['-date']
    