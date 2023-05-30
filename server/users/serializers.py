from rest_framework import serializers
from django.contrib.auth import get_user_model
from reviews.models import Review
from streaks.serializers import GetDatesStudiedSerializer
from languages.models import Course, Language, CourseLevels, UsersProgressOnCourse
from languages.serializers import CourseSerializer, LanguageSerializer
from dj_rest_auth.registration.serializers import SocialLoginSerializer
from allauth.socialaccount.helpers import complete_social_login
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
from django.utils.translation import gettext_lazy as _
from requests.exceptions import HTTPError
from django.http import HttpResponseBadRequest

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['id']

    def create(self, validated_data, instance=None):
        japanese_language = Language.objects.get(name='Japanese')
        user = get_user_model().objects.create(**validated_data)
        user.languages.add(japanese_language)
        if validated_data['password'] == 'unusable':
            user.set_unusable_password()
        else:
            user.set_password(validated_data['password'])
        user.save()
        course = Course.objects.get(name='main', language_this_course_teaches=japanese_language)
        course.save()
        UsersProgressOnCourse.objects.create(user=user, course=course, current_level=CourseLevels.objects.get(course=course, number=1))

        return user
    
    def update(self, instance, validated_data):
        print("HERE TO SAVE THE DAY!!!!")
        japanese_language = Language.objects.get(name='Japanese')
        instance.languages.add(japanese_language)
        instance.save()
        course = Course.objects.get(name='main', language_this_course_teaches=japanese_language)
        course.save()
        UsersProgressOnCourse.objects.create(user=instance, course=course, current_level=CourseLevels.objects.get(course=course, number=1))

        return instance

class UserLessonInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            'currentLesson',
            'currentSplit',
            'readMsgForCurrentLevel',
            'experience_points',
        ]

class UserGeneralInfoSerializer(serializers.ModelSerializer):
    dates_studied = GetDatesStudiedSerializer(many=True)
    courses = CourseSerializer(many=True)
    languages = LanguageSerializer(many=True)
    class Meta:
        model = get_user_model()
        fields = [
            'username',
            'email',
            'experience_points',
            'profile_picture',
            'date_joined',
            'dates_studied',
            'courses',
            'languages',
            'srs_limit',
            'num_of_subjects_to_teach_per_lesson',
            'wants_reminder_emails',
            'reminder_emails_review_threshold',
        ]
        read_only_fields = [
            *fields
        ]

class UserSrsSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            'srs_limit',
            'srs_subjects_added_today',
        ]
        read_only_fields = [
            *fields
        ]
