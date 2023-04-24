# Generated by Django 4.1.7 on 2023-04-24 12:42

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subjects', '0007_acceptableresponsesbutnotwhatlookingfor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='japanesevocabulary',
            name='main_meanings_to_use',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(max_length=80), default=list, size=None),
        ),
    ]