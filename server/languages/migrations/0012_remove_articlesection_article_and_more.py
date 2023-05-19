# Generated by Django 4.1.7 on 2023-05-19 22:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0001_initial'),
        ('languages', '0011_articlesection_position'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='articlesection',
            name='article',
        ),
        migrations.RemoveField(
            model_name='usersarticleprogress',
            name='article',
        ),
        migrations.RemoveField(
            model_name='usersarticleprogress',
            name='user',
        ),
        migrations.AddField(
            model_name='courselevels',
            name='suggested_article',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='levels_that_use_this', to='articles.article'),
        ),
        migrations.DeleteModel(
            name='Article',
        ),
        migrations.DeleteModel(
            name='ArticleSection',
        ),
        migrations.DeleteModel(
            name='UsersArticleProgress',
        ),
    ]
