# Generated by Django 4.1.7 on 2023-04-14 00:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subjects', '0004_japanesecounterword_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='japanesecounterword',
            name='normal_reading',
            field=models.CharField(default='', max_length=5),
            preserve_default=False,
        ),
    ]