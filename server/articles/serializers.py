from rest_framework import serializers
from .models import (
    Article, 
    Tag,
)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model=Tag
        fields=['name']
        editable=False

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            'title',
            'body',
            'meta_description'
        ]
        editable=False

class ArticePreviewSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    class Meta:
        model = Article
        fields = [
            'title',
            'body',
            'slug',
        ]
        editable=False
