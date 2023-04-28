# Generated by Django 4.1.7 on 2023-04-27 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subjects', '0010_subjectsdifferencesexplanation_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='subjectsdifferencesexplanation',
            name='general_difference',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='subjectsdifferencesexplanation',
            name='difference_from_perspective_of_first_subject',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='subjectsdifferencesexplanation',
            name='difference_from_perspective_of_second_subject',
            field=models.TextField(null=True),
        ),
    ]