from rest_framework import serializers
from .models import DatesStudied

class GetDatesStudiedSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatesStudied

        fields = [
            'expGained',
            'date',
        ]
        
        read_only_fields = [
            *fields
        ]
