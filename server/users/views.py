from .serializers import (
    CreateUserSerializer, 
    UserLessonInfoSerializer, 
    UserGeneralInfoSerializer,
    UserSrsSerializer,
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
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.views import (
    OAuth2Adapter
)
from allauth.socialaccount.providers.google.provider import GoogleProvider
import jwt
import random
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
from django.core.exceptions import ObjectDoesNotExist
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

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
    def get(self, request, format=None):
        userSerializer = UserGeneralInfoSerializer(request.user)
        allUsersSrsCards = ReviewsLevelAndDateSerializer(Review.objects.filter(user=request.user.id), many=True)
        return Response(
            {
                **userSerializer.data, 
                'user_is_on_free_trial': request.user.user_is_on_free_trial(),
                'has_access_to_paid_features': request.user.has_access_to_paid_features(),
                'review_cards': allUsersSrsCards.data,
            }
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
    
def get_token_auth_header(request):
    """Obtains the Access Token from the Authorization Header"""
    auth = request.META.get('HTTP_AUTHORIZATION', '').split()
    if len(auth) != 2:
        return Response({'status': 'error', 'error': 'Invalid header. No credentials provided.'}, status=401)

    elif auth[0].lower() != 'bearer':
        return Response({'status': 'error', 'error': 'Invalid header. No "Bearer" keyword.'}, status=401)

    return auth[1]

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter

def generate_random_username():
    while True:
        random_username = f"User{''.join([str(random.randint(0, 9)) for _ in range(8)])}"
        if not User.objects.filter(username=random_username).exists():
            return random_username

# class GoogleOAuth2Adapter(OAuth2Adapter):
#     provider_id = GoogleProvider.id
#     access_token_url = 'https://oauth2.googleapis.com/token'
#     authorize_url = 'https://accounts.google.com/o/oauth2/v2/auth'
#     id_token_issuer = 'https://accounts.google.com'

#     def complete_login(self, request, app, token, response, **kwargs):
#         try:
#             identity_data = jwt.decode(
#                 response["id_token"],
#                 options={
#                     "verify_signature": False,
#                     "verify_iss": True,
#                     "verify_aud": True,
#                     "verify_exp": True,
#                 },
#                 issuer=self.id_token_issuer,
#                 audience=app.client_id,
#             )
#         except jwt.PyJWTError as e:
#             raise OAuth2Error("Invalid id_token") from e
#         login = self.get_provider().sociallogin_from_response(request, identity_data)
#         email = login.email_addresses[0].email
#         try:
#             User.objects.get(email=email)
#         except ObjectDoesNotExist:
#             print('does not exist')
#             # serializer = CreateUserSerializer(data={
#             #         'email': email,
#             #         'password': 'unusable',
#             #         'username': generate_random_username()
#             #     },
#             # )
#             # if serializer.is_valid():
#             #     serializer.save()
#             # else:
#             #     raise Exception(serializer.errors)
#             # pass
#         return login

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = '/lessons?just_joined=true'
    client_class = OAuth2Client
