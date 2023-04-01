from rest_framework import serializers
from .models import Review, SpacedRepetitionSystem, SpacedRepetitionSystemStages
from subjects.serializers import SubjectPolymorphicSerializer

class SpacedRepetitionSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpacedRepetitionSystem
        editable = False
        fields = [
            'name'
        ]

class SpacedRepetitionSystemStagesSerializers(serializers.ModelSerializer):
    system_this_belongs_to = SpacedRepetitionSystemSerializer()
    class Meta:
        model = SpacedRepetitionSystemStages
        editable = False
        fields = [
            'stage',
            'system_this_belongs_to'
        ]

class ReviewsSerializer(serializers.ModelSerializer):
    current_level = SpacedRepetitionSystemStagesSerializers()
    subject = SubjectPolymorphicSerializer()
    class Meta:
        model = Review
        fields = [
            'subject',
            'user',
            'current_level'
            # 'isFastReviewCard',
        ]
        
class ReviewsLevelAndDateSerializer(serializers.ModelSerializer):
    current_level = SpacedRepetitionSystemStagesSerializers()
    class Meta:
        model = Review
        fields = [
            'user',
            'next_review_date',
            'current_level',
            'times_this_was_completed'
            # 'isFastReviewCard',
        ]

