# Generated by Django 4.1.7 on 2023-05-04 17:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0002_remove_subscription_user_and_more'),
        ('users', '0004_user_subscription'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='subscription',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user', to='subscriptions.subscription'),
        ),
    ]
