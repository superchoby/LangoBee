# Generated by Django 4.1.7 on 2023-05-30 21:28

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('articles', '0004_alter_articletag_name_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='usersarticleprogress',
            unique_together={('user', 'article')},
        ),
    ]