# Generated by Django 4.1.7 on 2023-04-27 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stories', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='story',
            name='audio_link',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
