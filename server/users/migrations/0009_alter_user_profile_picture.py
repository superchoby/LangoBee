# Generated by Django 4.1.7 on 2023-05-08 20:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_remove_user_plantype'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.CharField(max_length=100, null=True),
        ),
    ]