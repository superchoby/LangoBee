from rest_framework import serializers
from .models import (
    Language, 
    Course, 
    UsersProgressOnCourse, 
    CourseLevels,
    Article,
    ArticleSection,
    LanguageStandardsLevels
)

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['name']

class ArticleSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleSection
        fields = ['header', 'content']
        editable = False

class ArticleSlugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['slug']
        editable = False

class ArticleSerializer(serializers.ModelSerializer):
    sections = ArticleSectionSerializer(many=True)
    class Meta:
        model = Article
        fields = ['title', 'sections', 'slug']
        editable = False


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']
        read_only_fields = [*fields]

class LanguageStandardsLevelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageStandardsLevels
        editable=False
        fields = [
            'name',
            'description',
        ]

class CourseLevelSerializer(serializers.ModelSerializer):
    article = ArticleSlugSerializer()
    standards_level = LanguageStandardsLevelsSerializer()
    class Meta:
        model = CourseLevels
        editable = False
        fields = [
            'number',
            'article',
            'standards_level'
        ]

class UsersProgressOnCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersProgressOnCourse
        fields = ['current_level']
