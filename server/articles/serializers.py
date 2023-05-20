from rest_framework import serializers
from .models import (
    Article, 
    ArticleTag,
    LinkedArticles
)

class ArticleTagSerializer(serializers.ModelSerializer):
    class Meta:
        model=ArticleTag
        fields=['name']
        editable=False

class ArticleTitleAndSlugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            'title',
            'slug'
        ]
        editable=False

class LinkedArticlesSerializer(serializers.ModelSerializer):
    article_being_linked_to = ArticleTitleAndSlugSerializer()
    class Meta:
        model = LinkedArticles
        fields = [
            'article_being_linked_to',
            'relationship',
            'explanation',
        ]
        editable=False

class ArticleSerializer(serializers.ModelSerializer):
    linked_articles = LinkedArticlesSerializer(many=True, source='article_this_links_to_info', read_only=True)
    class Meta:
        model = Article
        fields = [
            'title',
            'body',
            'meta_description',
            'linked_articles'
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
