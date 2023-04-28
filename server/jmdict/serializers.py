from rest_framework import serializers
from .models import (
    JMDictEntries,
    JMDictKanjiVocab,
    JMDictKanaVocab,
    JMDictSense,
    JMDictLanguageSource,
    JMDictGloss
)

class JMDictKanjiVocabSerializer(serializers.ModelSerializer):
    class Meta:
        model=JMDictKanjiVocab
        editable=False
        fields=[
            'common',
            'text',
            'tags'
        ]

class JMDictKanaVocabSerializer(serializers.ModelSerializer):
    class Meta:
        model=JMDictKanaVocab
        editable=False
        fields=[
            'common',
            'text',
            'tags',
            'applies_to_kanji'
        ]

class JMDictLanguageSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model=JMDictLanguageSource
        editable=False
        fields=[
            'lang',
            'full',
            'wasei',
            'text'
        ]

class JMDictGlossSerializer(serializers.ModelSerializer):
    class Meta:
        model=JMDictGloss
        editable=False
        fields=[
            'lang',
            'gender',
            'type',
            'text',
        ]

class JMDictSenseSerializer(serializers.ModelSerializer):
    language_source = JMDictLanguageSourceSerializer(many=True)
    gloss = JMDictGlossSerializer(many=True)

    class Meta:
        model=JMDictSense
        editable=False
        fields=[
            'part_of_speech',
            'applies_to_kanji',
            'applies_to_kana',
            'related',
            'antonym',
            'field',
            'dialect',
            'misc',
            'info',
            'language_source',
            'gloss'
        ]

class JMDictEntriesSerializer(serializers.ModelSerializer):
    kanji_vocabulary = JMDictKanjiVocabSerializer(many=True)
    kana_vocabulary = JMDictKanaVocabSerializer(many=True)
    sense = JMDictSenseSerializer(many=True)

    class Meta:
        model=JMDictEntries
        editable=False
        fields=[
            'jm_dict_id',
            'kanji_vocabulary',
            'kana_vocabulary',
            'sense'
        ]


class JMDictGlossSerializerForVocabDifferences(serializers.ModelSerializer):
    class Meta:
        model=JMDictGloss
        editable=False
        fields=[
            'text',
        ]

class JMDictSenseSerializerForVocabDifferences(serializers.ModelSerializer):
    gloss = JMDictGlossSerializerForVocabDifferences(many=True)

    class Meta:
        model=JMDictSense
        editable=False
        fields=[
            'gloss'
        ]

class JmDictEntriesSerializerForVocabDifferences(serializers.ModelSerializer):
    sense = JMDictSenseSerializerForVocabDifferences(many=True)

    class Meta:
        model=JMDictEntries
        editable=False
        fields=[
            'sense'
        ]

        