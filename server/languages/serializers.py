from rest_framework import serializers
from .models import (
    Language, 
    Course, 
    UsersProgressOnCourse, 
    CourseLevels,
    LanguageStandardsLevels,
    TestForSkippingACoursesLevels,
    CustomQuestionForTestForSkippingACoursesLevels,
    WrongChoicesForCustomQuestionForTestForSkippingACoursesLevels
)
from articles.serializers import ArticePreviewSerializer

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['name']

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
    suggested_article = ArticePreviewSerializer()
    standards_level = LanguageStandardsLevelsSerializer()
    test_that_ends_here = TestForSkippingACoursesLevelsSerializer()

    class Meta:
        model = CourseLevels
        editable = False
        fields = [
            'number',
            'suggested_article',
            'standards_level',
            'test_that_ends_here'
        ]


class CourseLevelNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseLevels
        editable = False
        fields = [
            'number',
        ]