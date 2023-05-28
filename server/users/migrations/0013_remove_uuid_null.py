# Generated by Django 4.1.7 on 2023-05-28 18:17

from django.db import migrations, models
import uuid

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_populate_uuid_values'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
