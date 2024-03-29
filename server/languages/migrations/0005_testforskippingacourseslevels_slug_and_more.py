# Generated by Django 4.1.7 on 2023-05-01 15:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('languages', '0004_customquestionfortestforskippingacourseslevels_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='testforskippingacourseslevels',
            name='slug',
            field=models.SlugField(default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='wrongchoicesforcustomquestionfortestforskippingacourseslevels',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wrong_choices', to='languages.customquestionfortestforskippingacourseslevels'),
        ),
    ]
