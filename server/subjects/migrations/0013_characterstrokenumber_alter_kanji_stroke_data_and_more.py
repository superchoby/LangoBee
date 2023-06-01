# Generated by Django 4.1.7 on 2023-05-23 12:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('subjects', '0012_kanjistrokedata_kanjistrokenumber_kanji_stroke_data'),
    ]

    operations = [
        migrations.CreateModel(
            name='CharacterStrokeNumber',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField()),
                ('transform', models.CharField(max_length=30)),
            ],
        ),
        migrations.AlterField(
            model_name='kanji',
            name='stroke_data',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='subjects.kanjistrokedata'),
        ),
        migrations.RenameModel(
            old_name='KanjiStrokeData',
            new_name='CharacterStrokeData',
        ),
        migrations.DeleteModel(
            name='KanjiStrokeNumber',
        ),
        migrations.AddField(
            model_name='characterstrokenumber',
            name='character_stroke_data',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='character_stroke_numbers', to='subjects.characterstrokedata'),
        ),
    ]