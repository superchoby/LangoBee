# Generated by Django 4.1.7 on 2023-04-27 03:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subjects', '0008_alter_japanesevocabulary_main_meanings_to_use'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='grammar',
            options={},
        ),
        migrations.AlterField(
            model_name='grammar',
            name='name',
            field=models.CharField(max_length=150),
        ),
        migrations.AlterUniqueTogether(
            name='grammar',
            unique_together={('name', 'meaning')},
        ),
    ]