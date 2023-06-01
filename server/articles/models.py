from django.db import models
from django.contrib.auth import get_user_model

tags = [
    ('vocabulary', 'vocabulary'),
    ('grammar', 'grammar'),
    ('speaking', 'speaking'),
    ('listening', 'listening'),
    ('kanji', 'kanji'),
    ('alphabet', 'alphabet'),
    ('kana', 'kana'),
    ('learning', 'general language learning')
]

linked_articles_types = [
    ('additional_reading', 'Suggested article for the user to read after they finish their current one'),
    ('prerequisite', "Suggested article for users to read before reading the current article if they aren't familiar with what is taught in the prereq article"),
]

class ArticleTagManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)

class ArticleTag(models.Model):
    name = models.CharField(choices=tags, max_length=max(len(choice[0]) for choice in tags), unique=True)

    objects = ArticleTagManager()
    
    def __str__(self):
        return self.name

class ArticleManager(models.Manager):
    def get_by_natural_key(self, slug):
        return self.get(slug=slug)

# Create your models here.
class Article(models.Model):
    language = models.ForeignKey('languages.Language', on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    body = models.TextField()
    meta_description = models.CharField(max_length=150, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    date_modified = models.DateTimeField(auto_now=True, null=True)
    publish_date = models.DateTimeField(blank=True, null=True)
    published = models.BooleanField(default=False)
    tags = models.ManyToManyField(ArticleTag, blank=True, related_name='articles_with_this_tag')
    users_that_have_read_this = models.ManyToManyField(get_user_model(), related_name='read_articles', through='UsersArticleProgress')
    linked_articles = models.ManyToManyField('self', symmetrical=False, related_name='articles_that_link_to_this', through='LinkedArticles')

    objects = ArticleManager()

    def __str__(self):
        return self.title

class LinkedArticles(models.Model):
    article_with_link = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_this_links_to_info')
    article_being_linked_to = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_that_links_to_this_info')
    relationship = models.CharField(choices=linked_articles_types, max_length=max(len(choice[0]) for choice in linked_articles_types))
    explanation = models.CharField(max_length=200)

class UsersArticleProgress(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='articles_progress')
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    user_finished_reading_this = models.BooleanField(default=False)

    class Meta:
        unique_together = (('user', 'article'),)
