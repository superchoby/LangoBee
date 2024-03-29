# Generated by Django 4.1.7 on 2023-04-01 08:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('slug', models.SlugField()),
            ],
        ),
        migrations.CreateModel(
            name='ArticleSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('header', models.CharField(max_length=100, null=True)),
                ('content', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('main', 'Main course of that language')], max_length=70)),
            ],
        ),
        migrations.CreateModel(
            name='CourseLevels',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField()),
            ],
            options={
                'ordering': ['number'],
            },
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('Japanese', 'Japanese'), ('English', 'English')], max_length=15, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='LanguageStandardsLevels',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='UserEnrolledInLanguage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_is_currently_studying_this_language', models.BooleanField(default=False)),
                ('date_enrolled', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='UsersArticleProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_finished_reading_this', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='UsersProgressOnCourse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users_progress', to='languages.course')),
                ('current_level', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='course_level', to='languages.courselevels')),
            ],
        ),
    ]
