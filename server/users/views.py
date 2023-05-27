from .serializers import (
    CreateUserSerializer, 
    UserLessonInfoSerializer, 
    UserGeneralInfoSerializer,
    UserSrsSerializer
)
from rest_framework import mixins, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from reviews.models import Review
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from reviews.serializers import ReviewsLevelAndDateSerializer
from django.utils import timezone
import os
import boto3
import uuid
from django.conf import settings
import logging
from botocore.exceptions import ClientError
from mimetypes import guess_type
from django.core.mail import send_mail
# from server.require_auth import require_auth

# Create your views here.
class CreateUserView(mixins.CreateModelMixin, generics.GenericAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({ 
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserInfo(APIView):
    def get(self, request, format=None):
        user = request.user
        userSerializer = UserGeneralInfoSerializer(user)
        return Response(userSerializer.data)

class UserHomepageView(APIView):
    # @require_auth(None)
    def get(self, request, format=None):
        user = request.user
        userSerializer = UserGeneralInfoSerializer(user)
        print (vars(request.user), ' THE VARS')
        print(request.user.id, 'THE USERS ID')
        # allUsersSrsCards = ReviewsLevelAndDateSerializer(Review.objects.filter(user=request.user.id), many=True)
        return Response({}
            # {
            #     **userSerializer.data, 
            #     'user_is_on_free_trial': user.user_is_on_free_trial(),
            #     'has_access_to_paid_features': user.has_access_to_paid_features(),
            #     'review_cards': allUsersSrsCards.data,
            # }
        )

class UserLessonInfoView(APIView):
    def post(self, request, format=None):     
        serializer = UserLessonInfoSerializer(request.user, data=request.data)
        if serializer.is_valid():
            user = User.objects.get(id=request.user.id)
            minDate = timezone.now().replace(hour=0, minute=0, second=0)
            maxDate = timezone.now().replace(hour=23, minute=59, second=59)
            studyDate = None
            if (user.dates_studied.filter(date__gte=minDate, date__lte=maxDate).exists()):
                studyDate = user.dates_studied.get(date__gte=minDate, date__lte=maxDate).update(expGained=studyDate.expGained + 5)
            else:
                studyDate = user.dates_studied.create(expGained = 5)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    IS_IN_PROD_ENVIRON = 'SECRET_KEY' in os.environ
    fullUrl = ('https://www.langobee.com' if IS_IN_PROD_ENVIRON else 'http://localhost:3000') + f'/reset-password/{reset_password_token.key}'

    try:
        send_mail(
            "Password Reset for LangoBee",
            f"""
                Hello {User.objects.get(username=reset_password_token.user).username.capitalize()}, 

                There was recently a request to change the password for your account.

                If you requested this change, set a new password here:

                {fullUrl}

                Note: This url is invalid after 24 hours.

                If you did not make this request, you can ignore this email and your password will remain the same.
            """,
            settings.EMAIL_HOST_USER,
            [reset_password_token.user.email]
        )
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)
        
class UserUploadPfp(APIView):
    def post(self, request, format=None):
        image_file = request.FILES.get('new_pfp', None)
        filename = f"{uuid.uuid4()}.{image_file.name.split('.')[-1]}"
        aws_pfp_image_directory = 'prod' if settings.IS_IN_PROD_ENVIRON else 'dev'
        pfp_directory = f'profile_pics/{aws_pfp_image_directory}/'
        key = f'{pfp_directory}{filename}'
        content_type = guess_type(image_file.name)[0]

        # Upload the file
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
        try:
            # s3_client.upload_file(file_name, bucket, object_name)
            s3_client.upload_fileobj(
                image_file,
                'langobee',
                key,
                ExtraArgs={'ContentType': content_type}
            )

            if request.user.profile_picture is not None:
                s3_client.delete_object(
                    Bucket='langobee',
                    Key=f'{pfp_directory}{request.user.profile_picture}',
                )
            request.user.profile_picture = filename
            request.user.save()
            return Response({
                'new_pfp_url': filename,
            }, status=status.HTTP_200_OK)
        
        except ClientError as e:
            print(e)
            logging.error(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ViewedLessonIntro(APIView):
    def get(self, request, format=None):      
        try:
            request.user.update(readMsgForCurrentLevel=True)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UpdateExperiencePoints(APIView):
    def post(self, request, format=None):
        try:
            user = request.user
            user.experience_points += request.data['expPointsGained']
            minDate = timezone.now().replace(hour=0, minute=0, second=0)
            maxDate = timezone.now().replace(hour=23, minute=59, second=59)
            studyDate = None
            if (user.dates_studied.filter(date__gte=minDate, date__lte=maxDate).exists()):
                studyDate = user.dates_studied.get(date__gte=minDate, date__lte=maxDate).update(expGained=studyDate.expGained + 5)
            else:
                studyDate = user.dates_studied.create(expGained = 5)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

default_jlpt_stats = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
    'other': 0
}

class GetUsersStats(APIView):
    def post(self, request, format=None):
        user = request.user
        # Will make this adjustable to any language in the future
        # language = Language.objects.get(name=request.data['language'])
        reviews_completed = sum([review.times_this_was_completed for review in user.reviews.all()])
        lessons_completed = len(user.reviews.filter(user_already_knows_this=False))
        users_subjects = request.user.subjects.all()
        completed_kanji_levels = { **default_jlpt_stats }
        completed_vocab_levels = { **default_jlpt_stats }
        completed_grammar_levels = { **default_jlpt_stats }

        for japanese_subject in users_subjects:
            # if japanese_subject.subject_type === 'grammar':

            subject_type = japanese_subject.japanese_subject_type
            jlpt_level = japanese_subject.jlpt_level
            if subject_type == 'kanji':
                completed_kanji_levels[jlpt_level if jlpt_level else 'other'] += 1
            elif subject_type == 'vocabulary':
                completed_vocab_levels[jlpt_level if jlpt_level else 'other'] += 1
            elif subject_type == 'grammar':
                completed_grammar_levels[jlpt_level if jlpt_level else 'other'] += 1
    
        return Response(data={
            'lessons_completed': lessons_completed,
            'reviews_completed': reviews_completed,
            'completed_kanji_levels': completed_kanji_levels,
            'completed_vocab_levels': completed_vocab_levels,
            'completed_grammar_levels': completed_grammar_levels
        })

class UserSrsView(APIView):
    def get(self, request, format=None):
        user = request.user

        # TODO: mock test date
        minDate = timezone.now().replace(hour=0, minute=0, second=0)
        maxDate = timezone.now().replace(hour=23, minute=59, second=59)
        if not (user.dates_studied.filter(date__gte=minDate, date__lte=maxDate).exists()):
            user.srs_subjects_added_today = 0
            user.save()

        return Response(UserSrsSerializer(user).data)
        
class UserSrsLimit(APIView):
    def post(self, request, format=None):
        user = request.user
        user.srs_limit = request.data['newSrsLimit']
        user.save()
        return Response(status=status.HTTP_200_OK)
        
class DeleteUser(APIView):
    def get(self, request):
        user = request.user
        user.delete()
        return Response(status=status.HTTP_200_OK)
    
class SubjectsPerSessionLimit(APIView):
    def post(self, request):
        user = request.user
        user.num_of_subjects_to_teach_per_lesson = request.data['newSubjectsLimit']
        user.save()
        return Response(status=status.HTTP_200_OK)

class ReminderEmailsView(APIView):
    def post(self, request):
        user = request.user
        user.wants_reminder_emails = request.data['wants_reminder_emails']
        user.save()
        return Response(status=status.HTTP_200_OK)
    
class ReminderEmailsThresholdView(APIView):
    def post(self, request):
        user = request.user
        user.reminder_emails_review_threshold = request.data['reminder_emails_review_threshold']
        user.save()
        return Response(status=status.HTTP_200_OK)
    
# class SocialLoginView(APIView):
#     permission_classes = [permissions.AllowAny]

#     @psa('social:complete')
#     def post(self, request, backend):
#         user = request.backend.do_auth(request.data.get('access_token'))
#         if user:
#             refresh = RefreshToken.for_user(user)

#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             })
#         else:
#             return Response({"error": "Wrong login details"})
