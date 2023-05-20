from rest_framework import serializers
from .models import (
    Article, 
    ArticleTag,
)

class ArticleTagSerializer(serializers.ModelSerializer):
    class Meta:
        model=ArticleTag
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

class ArticlePreviewSerializer(serializers.ModelSerializer):
    tags = ArticleTagSerializer(many=True)
    class Meta:
        model = Article
        fields = [
            'title',
            'body',
            'slug',
            'tags'
        ]
        editable=False
