from django.db import models
from django.contrib.auth import get_user_model
from .test_statuses import (
    PASSED_TEST,
    FAILED_TEST,
    NEVER_TAKEN_TEST,
    IN_PROGRESS_TEST,
)

languages = [
    ('Japanese', 'Japanese'),
    ('English', 'English')
]

courseNames = [
    ('main', 'Main course of that language'),
]

class LanguageManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)

class Language(models.Model):
    name = models.CharField(max_length=15, choices=languages, unique=True)
    users = models.ManyToManyField(get_user_model(), related_name='languages', through='UserEnrolledInLanguage')

    objects = LanguageManager()
    
    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.name)

class CourseManager(models.Manager):
    def get_by_natural_key(self, language_that_this_course_teaches, name_of_course):
        language = Language.objects.get(name=language_that_this_course_teaches)
        return self.get(language_this_course_teaches=language, name=name_of_course)

class Course(models.Model):
    name = models.CharField(max_length=70, choices=courseNames)
    users = models.ManyToManyField(get_user_model(), related_name='courses', through='UsersProgressOnCourse')
    language_this_course_teaches = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='courses_teaching_this_language')
    language_taught_in = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='courses_taught_in_this_language')

    objects = CourseManager()

    class Meta:
        unique_together = (
            ('name', 'language_this_course_teaches'),
        )

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.language_this_course_teaches.name, self.name)

class CourseLevelsManager(models.Manager):
    def get_by_natural_key(self, number, language_name, course_name):
        course = Course.objects.get(name=course_name, language_this_course_teaches=Language.objects.get(name=language_name))
        return self.get(number=number, course=course)

class CourseLevels(models.Model):
    number = models.PositiveIntegerField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='levels')
    # users_that_have_started_this_course = models.Many(get_user_model())

    objects = CourseLevelsManager()

    class Meta:
        ordering = ['number']

    def __str__(self):
        return f'{self.course.name} {self.number}'

    def natural_key(self):
        return (self.number, self.course.language_this_course_teaches.name, self.course.name)
    
class LanguageStandardLevelsManager(models.Manager):
    def get_by_natural_key(self, name, language_name):
        language = Language.objects.get(name=language_name)
        return self.get(name=name, language=language)
    
class LanguageStandardsLevels(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField()
    level_it_starts_at = models.OneToOneField(CourseLevels, on_delete=models.SET_NULL, null=True, related_name='standards_level')
    language = models.ForeignKey(Language, on_delete=models.CASCADE)

    objects = LanguageStandardLevelsManager

    def __str__(self):
        return f'{self.name} {self.description}'

    def natural_key(self):
        return (self.name, self.language.name)
    
class TestForSkippingACoursesLevels(models.Model):
    text_to_encourage_user_to_take = models.TextField(unique=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='check_points')
    levels_this_starts_to_cover = models.OneToOneField(CourseLevels, on_delete=models.CASCADE, related_name='test_that_starts_here')
    levels_this_finishes_covering = models.OneToOneField(CourseLevels, on_delete=models.CASCADE, related_name='test_that_ends_here')
    users_that_have_taken_this = models.ManyToManyField(get_user_model(), related_name='tests_taken', through='UsersProgressOnTest')
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.description
    
class UsersProgressOnTest(models.Model):
    statuses = [
        (PASSED_TEST, 'passed'),
        (FAILED_TEST, 'failed'),
        (NEVER_TAKEN_TEST, 'has never taken this test'),
        (IN_PROGRESS_TEST, 'stopped taking the test partway through')
    ]

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='progress_on_tests')
    test = models.ForeignKey(TestForSkippingACoursesLevels, on_delete=models.Case, related_name='users_progress_on_this')
    status = models.CharField(choices=languages, max_length=max(len(status_choice[0]) for status_choice in statuses), default=NEVER_TAKEN_TEST)

class CustomQuestionForTestForSkippingACoursesLevels(models.Model):
    test = models.ForeignKey(TestForSkippingACoursesLevels, on_delete=models.CASCADE, related_name='custom_questions')
    subjects_covered = models.ManyToManyField('subjects.Subject', related_name='custom_questions_for_test_that_cover_this')
    question = models.CharField(max_length=30)
    answer = models.CharField(max_length=20)

    class Meta:
        unique_together = ('question', 'answer')

    def __str__(self):
        return self.question

class WrongChoicesForCustomQuestionForTestForSkippingACoursesLevels(models.Model):
    question = models.ForeignKey(CustomQuestionForTestForSkippingACoursesLevels, on_delete=models.CASCADE, related_name='wrong_choices')
    text = models.CharField(max_length=20)

    def __str__(self):
        return self.text

class Article(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='articles')
    level_that_it_appears_before = models.OneToOneField(CourseLevels, on_delete=models.CASCADE, related_name='article', null=True)
    title = models.CharField(max_length=100)
    users_that_have_read_this = models.ManyToManyField(get_user_model(), related_name='read_articles', through='UsersArticleProgress')
    slug = models.SlugField()

    def __str__(self):
        return self.title

class UsersArticleProgress(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='articles_progress')
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    user_finished_reading_this = models.BooleanField(default=False)

class ArticleSection(models.Model):
    header = models.CharField(max_length=100, null=True)
    content = models.TextField()
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='sections')

    def __str__(self):
        return self.header

class UserEnrolledInLanguage(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    user_is_currently_studying_this_language = models.BooleanField(default=False)
    date_enrolled = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.get_username()} studying ${self.language}'

class UsersProgressOnCourse(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='progress_on_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='users_progress')
    current_level = models.ForeignKey(CourseLevels, on_delete=models.SET_NULL, null=True, related_name='course_level')
