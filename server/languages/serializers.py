from rest_framework import serializers
from .models import (
    Language, 
    Course, 
    UsersProgressOnCourse, 
    CourseLevels,
    Article,
    ArticleSection,
    LanguageStandardsLevels,
    TestForSkippingACoursesLevels,
    CustomQuestionForTestForSkippingACoursesLevels,
    WrongChoicesForCustomQuestionForTestForSkippingACoursesLevels
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
        fields = ['slug', 'title']
        editable = False

class ArticleSerializer(serializers.ModelSerializer):
    sections = ArticleSectionSerializer(many=True)
    class Meta:
        model = Article
        fields = ['title', 'sections', 'slug', 'category']
        editable = False

    def get_sections(self, obj):
        get_first_section_only = self.context.get('get_first_section_only', False)
        if get_first_section_only:
            first_section = obj.sections.first()
            if first_section:
                return ArticleSectionSerializer(first_section).data
            else:
                return None
        else:
            return ArticleSectionSerializer(obj.sections.all(), many=True).data

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

class UsersProgressOnCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersProgressOnCourse
        fields = ['current_level']

class WrongChoicesForCustomQuestionForTestForSkippingACoursesLevelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WrongChoicesForCustomQuestionForTestForSkippingACoursesLevels
        editable = False
        fields = [
            'text',
        ]

class CustomQuestionForTestForSkippingACoursesLevelsSerializer(serializers.ModelSerializer):
    wrong_choices = WrongChoicesForCustomQuestionForTestForSkippingACoursesLevelsSerializer(many=True)

    class Meta:
        model = CustomQuestionForTestForSkippingACoursesLevels
        editable = False
        fields = [
            'question',
            'answer',
            'wrong_choices'
        ]

class TestForSkippingACoursesLevelsSerializer(serializers.ModelSerializer):
    custom_questions = CustomQuestionForTestForSkippingACoursesLevelsSerializer(many=True)

    class Meta:
        model = TestForSkippingACoursesLevels
        editable = False
        fields = [
            'text_to_encourage_user_to_take',
            'custom_questions',
            'slug'
        ]

class CourseLevelSerializer(serializers.ModelSerializer):
    article = ArticleSlugSerializer()
    standards_level = LanguageStandardsLevelsSerializer()
    test_that_ends_here = TestForSkippingACoursesLevelsSerializer()

    class Meta:
        model = CourseLevels
        editable = False
        fields = [
            'number',
            'article',
            'standards_level',
            'test_that_ends_here'
        ]
