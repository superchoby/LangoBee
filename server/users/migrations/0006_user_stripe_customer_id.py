# Generated by Django 4.1.7 on 2023-05-05 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_user_subscription'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='stripe_customer_id',
            field=models.CharField(max_length=40, null=True),
        ),
    ]
