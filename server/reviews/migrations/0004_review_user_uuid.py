# Generated by Django 4.1.7 on 2023-05-28 00:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='user_uuid',
            field=models.UUIDField(blank=True, editable=False, null=True),
        ),
    ]
