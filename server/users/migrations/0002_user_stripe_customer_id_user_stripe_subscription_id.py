# Generated by Django 4.1.7 on 2023-05-03 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='stripe_customer_id',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='stripe_subscription_id',
            field=models.TextField(null=True),
        ),
    ]
