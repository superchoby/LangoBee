# Generated by Django 4.1.7 on 2023-05-06 23:06

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0005_remove_subscription_needs_to_update_payment_information'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscription',
            name='start_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='stripe_price_id',
            field=models.CharField(max_length=50, null=True),
        ),
    ]