from rest_framework import serializers
from django.contrib.auth import get_user_model
from reviews.models import Review
from streaks.serializers import GetDatesStudiedSerializer
from languages.models import Course, Language, CourseLevels, UsersProgressOnCourse
from languages.serializers import CourseSerializer, LanguageSerializer
from reviews.serializers import SpacedRepetitionSystemStagesSerializers

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['id']

    def create(self, validated_data, instance=None):
        japanese_language = Language.objects.get(name='Japanese')
        user = get_user_model().objects.create(**validated_data)
        user.languages.add(japanese_language)
        user.set_password(validated_data['password'])
        user.save()
        
        # japanese_language.users.add(user)
        # japanese_language.save()
        course = Course.objects.get(name='main', language_this_course_teaches=japanese_language)
        # course.users.add(user, through_defaults={'current_level': CourseLevels.objects.get(course=course, number=1)})
        course.save()
        UsersProgressOnCourse.objects.create(user=user, course=course, current_level=CourseLevels.objects.get(course=course, number=1))
        # users_progress_on_this_course = core_course.users_progresses.get(user=user)
        # users_progress_on_this_course.current_level = CourseLevels.objects.get(course=course, number=1)
        # users_progress_on_this_course.save()
        return user

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
            'num_of_subjects_to_teach_per_lesson'
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
