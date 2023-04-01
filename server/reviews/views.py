from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Review, SpacedRepetitionSystemStages, SpacedRepetitionSystem, SpaceRepetitionSystems
from .serializers import ReviewsSerializer
from languages.models import UsersProgressOnCourse, CourseLevels
from rest_framework import status
from subjects.models import Subject
from datetime import timedelta
from users.models import User
from django.utils import timezone

def get_next_review_date(hours):
    now = timezone.now()
    timeToReturn = now + timedelta(hours=hours)
    return timeToReturn

# def calculate_new_srs_level(current_srs_level, user_got_subject_correct): 
#     if user_got_subject_correct and current_srs_level < 9: 
#       return current_srs_level + 1
#     else:
#       if current_srs_level == 0 or current_srs_level == 1:
#         return 1
#       else:
#         return current_srs_level - 1

class ReviewView(APIView):
    def post(self, request, format=None):
        user = User.objects.get(pk=request.user.id)
        subject = Subject.objects.get(pk=request.data['subjectId'])
        user_is_reviewing = Review.objects.filter(user=user, subject=subject).exists()
        user_knows_this_subject = 'userKnows' in request.data and request.data['userKnows'] 
        if user_is_reviewing:
            srs_system_name = (SpaceRepetitionSystems.FAST if request.data['isFastReviewCard'] else SpaceRepetitionSystems.DEFAULT).value
            srs_system = SpacedRepetitionSystem.objects.get(name=srs_system_name) 
            review = Review.objects.get(user=user, subject=subject)
            new_review_level = SpacedRepetitionSystemStages.objects.get(
                stage=request.data['newSRSLevel'], 
                system_this_belongs_to=srs_system,
            )
            # eventually handle the times reading and writing incorrect features
            review.current_level = new_review_level
            if new_review_level.time_until_next_review: # If this is null, the user has reached the final level
                review.next_review_date = get_next_review_date(new_review_level.time_until_next_review)
            review.times_this_was_completed += 1
            review.save()
        else:
            if user_knows_this_subject:
                Review.objects.create(
                    user=user, 
                    subject=subject,
                    user_already_knows_this=True
                )
            else:
                srs_system_name = (SpaceRepetitionSystems.FAST if request.data['isFastReviewCard'] else SpaceRepetitionSystems.DEFAULT).value
                srs_system = SpacedRepetitionSystem.objects.get(name=srs_system_name) 
                Review.objects.create(
                    user=user, 
                    subject=subject,
                    next_review_date=timezone.now() + timedelta(hours=subject.srs_type.stages.get(stage=1).time_until_next_review),
                    current_level=SpacedRepetitionSystemStages.objects.get(
                        stage=1, 
                        system_this_belongs_to=srs_system,
                    )
                )

            progress_on_course = UsersProgressOnCourse.objects.get(user=user, course=subject.course)
            user_has_completed_level = True
            for subject in progress_on_course.current_level.subjects.all():
                if not request.user.subjects.filter(pk=subject.id).exists():
                    user_has_completed_level = False
                    break
            
            if user_has_completed_level:
                progress_on_course.current_level = CourseLevels.objects.get(
                    number=progress_on_course.current_level.number + 1,
                    course=subject.course
                )
                progress_on_course.save()

        minDate = timezone.now().replace(hour=0, minute=0, second=0)
        maxDate = timezone.now().replace(hour=23, minute=59, second=59)
        studyDate = None
        if (user.dates_studied.filter(date__gte=minDate, date__lte=maxDate).exists()):
            studyDate = user.dates_studied.get(date__gte=minDate, date__lte=maxDate)
            studyDate.expGained = studyDate.expGained + 5
            studyDate.save()
            if not user_is_reviewing and not user_knows_this_subject:
                user.srs_subjects_added_today += 1
        else:
            studyDate = user.dates_studied.create(expGained = 5)
            if not user_is_reviewing and not user_knows_this_subject:
                user.srs_subjects_added_today = 1
            elif user_is_reviewing:
                user.srs_subjects_added_today = 0

        user.experience_points += 5
        user.save()
        return Response(status=status.HTTP_200_OK)

    def get(self, request, format=None):
        # allUsersSrsCards = ReviewsSerializer(Review.objects.filter(user=request.user.id), many=True)
        user = User.objects.get(pk=request.user.id)
        reviews = ReviewsSerializer(user.reviews.filter(next_review_date__lte=timezone.now()), many=True)
        # for course in userSerializer.data['courses']:
        #     infoForThisCourse = UsersProgressOnCourse.objects.get(user=request.user, course=course['id'])
        #     coursesInfo[course['name']] = {
        #         'currentLesson': infoForThisCourse.currentLesson,
        #         'currentSplitOnLesson': infoForThisCourse.currentSplitOnLesson,
        #     }
        return Response(
            {
                'reviews': reviews.data,
            }
        )

stageToNextReviewTimeHoursNormalCards = [
    -1, # filler
    4, 
    8, 
    24, # 1 day
    48, # 2 days
    168, # 1 week
    336, # 2 weeks
    720, # 1 month
    2880, # 4 months
]

stageToNextReviewTimeHoursFastCards = [
    -1,
    2,
    4,
    8,
    24,
]

class UpdateReviewStatus(APIView):
    def post(self, request, format=None):    
        pass
        # try:
        #     conceptToReview = request.data['concept']
        #     gotCorrect = request.data['gotCorrect']
        #     srsFlashcard = SRSFlashcard.objects.get(user=request.user.id, conceptToReview=conceptToReview)
        #     user = User.objects.get(id=request.user.id)
        #     user.experiencePoints = user.experiencePoints + 5
        #     minDate = timezone.now().replace(hour=0, minute=0, second=0)
        #     maxDate = timezone.now().replace(hour=23, minute=59, second=59)
        #     studyDate = None
        #     if (user.dates_studied.filter(date__gte=minDate, date__lte=maxDate).exists()):
        #         user.dates_studied.get(date__gte=minDate, date__lte=maxDate).update(expGained=studyDate.expGained + 5)
        #     else:
        #         user.dates_studied.create(expGained=5)
        #     if srsFlashcard.isFastReviewCard:
        #         if gotCorrect:
        #             if srsFlashcard.currentStage < 4:
        #                 srsFlashcard.nextReviewDate = timezone.now() + timedelta(hours=stageToNextReviewTimeHoursFastCards[srsFlashcard.currentStage + 1])
        #             else:
        #                 srsFlashcard.nextReviewDate = datetime.max
        #             srsFlashcard.currentStage += 1
        #             srsFlashcard.save()
        #         else:
        #             if srsFlashcard.currentStage > 1:
        #                 srsFlashcard.nextReviewDate = timezone.now() + timedelta(hours=stageToNextReviewTimeHoursFastCards[srsFlashcard.currentStage - 1])
        #                 srsFlashcard.currentStage -= 1
        #                 srsFlashcard.save()
        #             else:
        #                 srsFlashcard.nextReviewDate = timezone.now() + timedelta(hours=2)
        #                 srsFlashcard.save()
        #     else:
        #         if gotCorrect:
        #             if srsFlashcard.currentStage < 8:
        #                 srsFlashcard.nextReviewDate = timezone.now() + timedelta(hours=stageToNextReviewTimeHoursNormalCards[srsFlashcard.currentStage + 1])
        #             else:
        #                 srsFlashcard.nextReviewDate = datetime.max
        #             srsFlashcard.currentStage += 1
        #             srsFlashcard.save()
        #         else:
        #             if srsFlashcard.currentStage > 1:
        #                 srsFlashcard.nextReviewDate = timezone.now() + timedelta(hours=stageToNextReviewTimeHoursNormalCards[srsFlashcard.currentStage - 1])
        #                 srsFlashcard.currentStage -= 1
        #                 srsFlashcard.save()
        #             else:
        #                 srsFlashcard.nextReviewDate = timezone.now() + timedelta(hours=4)
        #                 srsFlashcard.save()
            
        #     return Response(status=status.HTTP_200_OK)
        # except:
        #     return Response(status=status.HTTP_400_BAD_REQUEST)