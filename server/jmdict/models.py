from django.contrib.postgres.fields import ArrayField
from django.db import models
from .jmdict_tags import jmdict_tags

jmdict_tags_longest_tag = max([len(choice[0]) for choice in jmdict_tags])

class JMDictEntries(models.Model):
    jm_dict_id = models.PositiveIntegerField(primary_key=True)

class JMDictKanjiVocab(models.Model):
    common = models.BooleanField()
    text = models.CharField(max_length=100)
    tags = ArrayField(models.CharField(choices=jmdict_tags, max_length=(jmdict_tags_longest_tag)), default=list)
    jmdict_entry = models.ForeignKey(JMDictEntries, on_delete=models.CASCADE, related_name='kanji_vocabulary')

    def __str__(self):
        return self.name

class JMDictKanaVocab(models.Model):
    common = models.BooleanField()
    text = models.CharField(max_length=100)
    tags = ArrayField(models.CharField(choices=jmdict_tags, max_length=(jmdict_tags_longest_tag)), default=list)
    jmdict_entry = models.ForeignKey(JMDictEntries, on_delete=models.CASCADE, related_name='kana_vocabulary')
    applies_to_kanji = ArrayField(models.CharField(max_length=100), default=list)

    def __str__(self):
        return self.name

class JMDictSense(models.Model):
    part_of_speech = ArrayField(models.CharField(choices=jmdict_tags, max_length=(jmdict_tags_longest_tag)), default=list)
    applies_to_kanji = ArrayField(models.CharField(max_length=100), default=list)
    applies_to_kana = ArrayField(models.CharField(max_length=100), default=list)
    related = ArrayField(models.CharField(max_length=100), size=3, default=list)
    antonym = ArrayField(models.CharField(max_length=100), size=3, default=list)
    field = ArrayField(models.CharField(choices=jmdict_tags, max_length=(jmdict_tags_longest_tag)), default=list)
    dialect = ArrayField(models.CharField(choices=jmdict_tags, max_length=(jmdict_tags_longest_tag)), default=list)
    misc = ArrayField(models.CharField(choices=jmdict_tags, max_length=(jmdict_tags_longest_tag)), default=list)
    info = ArrayField(models.CharField(max_length=100), default=list)
    jmdict_entry = models.ForeignKey(JMDictEntries, on_delete=models.CASCADE, related_name='sense')

class JMDictLanguageSource(models.Model):
    lang = models.CharField(max_length=50)
    full = models.BooleanField()
    wasei = models.BooleanField()
    text = models.CharField(max_length=110, null=True)
    jmdict_sense = models.ForeignKey(JMDictSense, on_delete=models.CASCADE, related_name='language_source')

class JMDictGloss(models.Model):
    gender_choices = [
        ("masculine", "masculine"),
        ("feminine", "feminine"),
        ("neuter", "neuter")
    ]
    gloss_type_choices = [
        ("literal", "literal"),
        ("figurative", "figurative"),
        ("explanation", "explanation"),
        ("trademark", "trademark")
    ]
    lang = models.CharField(max_length=50)
    gender = models.CharField(choices=gender_choices, max_length=(max([len(choice[0]) for choice in gender_choices])), null=True)
    type = models.CharField(choices=gloss_type_choices, max_length=(max([len(choice[0]) for choice in gloss_type_choices])), null=True)
    text = models.TextField()
    jmdict_sense = models.ForeignKey(JMDictSense, on_delete=models.CASCADE, related_name='gloss')
