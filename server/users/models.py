from django.db import models
from django.contrib.auth.models import AbstractUser
from subscriptions.models import Subscription
from datetime import timedelta
from django.utils import timezone

class User(AbstractUser):
    PLAN_TYPES = (
        ('BETA_USER', 'Beta User'),
    )

    experience_points = models.PositiveIntegerField(default=0)
    email = models.EmailField(unique=True)
    profile_picture = models.CharField(max_length=100, null=True)
    srs_limit = models.PositiveIntegerField(default=20)
    srs_subjects_added_today = models.PositiveIntegerField(default=0)
    num_of_subjects_to_teach_per_lesson = models.PositiveIntegerField(default=5)
    subscription = models.OneToOneField(Subscription, on_delete=models.SET_NULL, related_name='user', null=True)
    wants_reminder_emails = models.BooleanField(default=True)
    reminder_emails_review_threshold = models.PositiveIntegerField(default=30)
    stripe_customer_id = models.CharField(max_length=40, null=True)
    needs_to_update_payment_information = models.BooleanField(default=False)

    def change_level(self, language, course_name, level):
        course = self.courses.get(language_this_course_teaches=self.languages.get(name=language), name=course_name)
        users_progress_on_course = self.progress_on_courses.get(course=course)
        users_progress_on_course.current_level = course.levels.get(number=level)
        
        subjects_to_mark_as_known = []
        for course_level in course.levels.order_by('number')[:users_progress_on_course.current_level.number - 1]:
            for subject in course_level.subjects.all():
                if not self.subjects.filter(pk=subject.id).exists():
                    subjects_to_mark_as_known.append(subject)
        #  Reviews models file imports user so I put import statement all the way down here so no circular dependency issue
        from reviews.models import Review
        self.reviews.bulk_create([Review(user=self, subject=subject, user_already_knows_this=True) for subject in subjects_to_mark_as_known])
        users_progress_on_course.save()

    def user_is_on_free_trial(self):
            now = timezone.now()
            seven_days_ago = now - timedelta(days=7)
            return self.date_joined >= seven_days_ago and self.subscription is None or self.subscription.subscription_plan is None
    
    def has_access_to_paid_features(self):
        return self.user_is_on_free_trial() or (self.subscription is not None and self.subscription.end_date >= timezone.now())

    def __str__(self):
        return self.username
