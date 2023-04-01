from rest_framework import serializers
from .models import (
    Story, 
    StorySectionTranslationExplanation, 
    StorySectionTranslation, 
    StorySection
)
from languages.serializers import LanguageSerializer

class StorySectionTranslationExplanationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorySectionTranslationExplanation
        fields = [
            'words_being_explained',
            'explanation'
        ]
        editable = False

class StorySectionTranslationSerializer(serializers.ModelSerializer):
    explanations = StorySectionTranslationExplanationSerializer(many=True)
    language = LanguageSerializer()
    class Meta:
        model = StorySectionTranslation
        fields = [
            'translation_text',
            'explanations',
            'language'
        ]
        editable = False

class StorySectionSerializer(serializers.ModelSerializer):
    translations = StorySectionTranslationSerializer(many=True)
    class Meta:
        model = StorySection
        fields = [
            'header',
            'text',
            'translations'
        ]
        editable = False

class ReadStorySerializer(serializers.ModelSerializer):
    sections = StorySectionSerializer(many=True)
    class Meta:
        model = Story
        fields = [
            'title',
            'recommended_level',
            'audio_link',
            'sections'
        ]
        editable = False

class StoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = [
            'title',
            'slug',
            'recommended_level',
        ]
        editable = False
