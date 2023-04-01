from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    PLAN_TYPES = (
        ('BETA_USER', 'Beta User'),
    )

    experience_points = models.PositiveIntegerField(default=0)
    email = models.EmailField(unique=True)
    profile_picture = models.CharField(max_length=100, default='')
    planType = models.CharField(max_length=20, choices=PLAN_TYPES, default='BETA_USER')
    srs_limit = models.PositiveBigIntegerField(default=20)
    srs_subjects_added_today = models.PositiveBigIntegerField(default=0)
    num_of_subjects_to_teach_per_lesson = models.PositiveBigIntegerField(default=5)

    def change_level(self, language, course_name, level):
        course = self.courses.get(language_this_course_teaches=self.languages.get(name=language), name=course_name)
        users_progress_on_course = self.progress_on_courses.get(course=course)
        users_progress_on_course.current_level = course.levels.get(number=level)
        users_progress_on_course.save()

    def __str__(self):
        return self.username
