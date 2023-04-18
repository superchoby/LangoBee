from .serializers import (
    CreateUserSerializer, 
    UserLessonInfoSerializer, 
    UserGeneralInfoSerializer,
    UserSrsSerializer
)
from rest_framework import mixins, generics
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from reviews.models import Review
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from reviews.serializers import ReviewsLevelAndDateSerializer
from django.utils import timezone
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

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
        user = request.user
        userSerializer = UserGeneralInfoSerializer(user)
        allUsersSrsCards = ReviewsLevelAndDateSerializer(Review.objects.filter(user=request.user.id), many=True)
        coursesInfo = {}
        # for course in userSerializer.data['courses']:
        #     infoForThisCourse = UsersProgressOnCourse.objects.get(user=request.user, course=course['id'])
        #     coursesInfo[course['name']] = {
        #         'currentLesson': infoForThisCourse.currentLesson,
        #         'currentSplitOnLesson': infoForThisCourse.currentSplitOnLesson,
        #     }
        return Response(
            {
                **userSerializer.data, 
                # 'coursesInfo': coursesInfo,
                # 'srsCards': list(map(lambda card: card['conceptToReview'], srsFlashcardsSerializer.data)),
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
    isInProdEnviron = 'SECRET_KEY' in os.environ
    fullUrl = ('https://www.langobee.com' if isInProdEnviron else 'http://localhost:3000') + f'/reset_password/{reset_password_token.key}'

    message = Mail(
        from_email='thomasqtrnh@gmail.com',
        to_emails=reset_password_token.user.email,
        subject="Password Reset for LangoBee",
        html_content=f"""
            Hello {User.objects.get(username=reset_password_token.user).username.capitalize()}, <br><br>

            There was recently a request to change the password for your account.<br><br>

            If you requested this change, set a new password here:<br><br>

            {fullUrl}<br><br>

            Note: This url is invalid after 24 hours.<br><br>

            If you did not make this request, you can ignore this email and your password will remain the same.
        """,
    )
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        sg.send(message)
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)
        
class UserUploadPfp(APIView):
    def post(self, request, format=None):
        try:
            User.objects.get(id=request.user.id).update(profilePicture=request.data['pfpId'])
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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
    