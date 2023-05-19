from django.db import models
from django.contrib.auth import get_user_model

tags = [
    ('vocabulary', 'vocabulary'),
    ('grammar', 'grammar'),
    ('speaking', 'speaking'),
    ('listening', 'listening'),
    ('kanji', 'kanji'),
    ('alphabet', 'alphabet'),
    ('kana', 'kana')
]

class Tag(models.Model):
    name = models.CharField(choices=tags, max_length=max(len(choice[0]) for choice in tags), unique=True)

    def __str__(self):
        return self.name

# Create your models here.
class Article(models.Model):
    language = models.ForeignKey('languages.Language', on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    body = models.TextField()
    meta_description = models.CharField(max_length=150, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    publish_date = models.DateTimeField(blank=True, null=True)
    published = models.BooleanField(default=False)
    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.title
    
class UsersArticleProgress(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='articles_progress')
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    user_finished_reading_this = models.BooleanField(default=False)
    