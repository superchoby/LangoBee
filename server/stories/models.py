from django.db import models
from django.contrib.auth import get_user_model
from languages.models import Language

class StoryManager(models.Manager):
    def get_by_natural_key(self, language_name, title):
        return self.get(title=title, language=Language.objects.get(name=language_name))



# Create your models here.
class Story(models.Model):
    title=models.CharField(max_length=50)
    slug=models.SlugField()
    recommended_level=models.PositiveIntegerField()
    audio_link=models.CharField(max_length=100, null=True)
    language=models.ForeignKey('languages.Language', related_name='stories', on_delete=models.CASCADE)
    likes=models.PositiveIntegerField(default=0)
    image=models.CharField(max_length=100)
    users_stats=models.ManyToManyField(get_user_model(), through='UsersProgressOnStory', related_name='stories_stats')

    objects = StoryManager()

    def __str__(self):
        return self.title

    def natural_key(self):
        return (Language.objects.get(name=self.language).name, self.title)

class UsersProgressOnStory(models.Model):
    # user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='progress_on_stories', to_field='uuid')
    user_uuid = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='progress_on_stories')
    # user_uuid = models.UUIDField(editable=False, null=True, blank=True)
    story = models.ForeignKey(Story, on_delete=models.CASCADE)
    completed_quiz = models.BooleanField(default=False)
    liked = models.BooleanField(default=False)

class StorySection(models.Model):
    header=models.CharField(max_length=50, blank=True, null=True)
    text=models.TextField()
    story=models.ForeignKey(Story, on_delete=models.CASCADE, related_name='sections')

class StorySectionTranslation(models.Model):
    translation_text=models.TextField()
    language=models.ForeignKey('languages.Language', on_delete=models.CASCADE)
    story_section_being_translated=models.ForeignKey(StorySection, on_delete=models.CASCADE, related_name='translations')

class StorySectionTranslationExplanation(models.Model):
    words_being_explained=models.TextField()
    explanation=models.TextField()
    translation_being_explained=models.ForeignKey(StorySectionTranslation, on_delete=models.CASCADE, related_name='explanations')
