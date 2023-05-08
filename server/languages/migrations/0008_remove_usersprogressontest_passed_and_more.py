# Generated by Django 4.1.7 on 2023-05-07 20:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('languages', '0007_alter_testforskippingacourseslevels_users_that_have_taken_this_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usersprogressontest',
            name='passed',
        ),
        migrations.AddField(
            model_name='usersprogressontest',
            name='status',
            field=models.BooleanField(choices=[('Japanese', 'Japanese'), ('English', 'English')], default=False, max_length=11),
        ),
    ]
