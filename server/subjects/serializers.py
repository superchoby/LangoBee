from rest_framework import serializers
from .models import (
    Subject, 
    JapaneseSubject, 
    Kana,
    CustomSubjectQuestions,
    Radical,
    Kanji,
    JapaneseVocabulary,
    Grammar,
    GrammarQuestion,
    GrammarQuestionTranslation,
    SubjectExample,
    SubjectExampleTranslation
)
from languages.serializers import LanguageSerializer
from jmdict.serializers import JMDictEntriesSerializer
from rest_polymorphic.serializers import PolymorphicSerializer

class SubjectExampleTranslationSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()
    class Meta:
        model = SubjectExampleTranslation
        editable=False
        fields = [
            'language',
            'translation'
        ]

class SubjectExampleSerializer(serializers.ModelSerializer):
    translations = SubjectExampleTranslationSerializer(many=True)
    class Meta:
        model = SubjectExample
        editable=False
        fields = [
            'example_text',
            'audio_file',
            'translations'
        ]

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        editable = False
        fields = [
            'position_in_course_level',
            'subject_type',
            'srs_type',
            'has_unique_subject_model'
        ]

class JapaneseSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = JapaneseSubject
        editable = False
        fields = [
            'japanese_subject_type',
            'jlpt_level'
        ]

class CustomSubjectQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomSubjectQuestions
        editable=False
        fields = [
            'question',
            'answers',
        ]

subjects_serializer_fields = [
    'id',
    'srs_type',
    'subject_type',
    'has_unique_subject_model'
]

japanese_subjects_serializer_fields = [
    *subjects_serializer_fields,
    'japanese_subject_type',
    'jlpt_level',
]

class KanaSerializer(serializers.ModelSerializer):
    custom_questions = CustomSubjectQuestionsSerializer(many=True)
    class Meta:
        model = Kana
        editable = False
        fields = [
            *japanese_subjects_serializer_fields,
            'character',
            'reading',
            'kana_type',
            'pronunciation_note',
            'is_special_kana',
            'special_kana_explanation',
            'mnemonic_explanation',
            'mnemonic_image',
            'mnemonic_image_content_type',
            'custom_questions'
        ]

class KanjiComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kanji
        editable=False
        fields = [
            'character',
            'meanings',
            'stroke_count',
            'freq',
            'grade'
        ]

class RadicalSerializer(serializers.ModelSerializer):
    kanji_that_uses_this = KanjiComponentSerializer(many=True)

    class Meta:
        model = Radical
        editable=False
        fields = [
            *japanese_subjects_serializer_fields,
            'character',
            'meaning',
            'mnemonic_explanation',
            'mnemonic_image',
            'mnemonic_image_content_type',
            'kanji_that_uses_this'
        ]

class RadicalComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Radical
        editable=False
        fields = [
            'character',
            'meaning',
        ]

class VocabularyExampleSerializer(serializers.ModelSerializer):
    jmdict = JMDictEntriesSerializer()
    class Meta:
        model = JapaneseVocabulary
        editable=False
        fields = [
            'jlpt_level',
            'jmdict',
        ]

class KanjiSerializer(serializers.ModelSerializer):  
    radicals_used = RadicalComponentSerializer(many=True)
    # vocabulary_that_uses_this = VocabularyExampleSerializer(many=True)
    class Meta:
        model = Kanji
        editable=False
        fields = [
            *japanese_subjects_serializer_fields,
            'character',
            'stroke_count',
            'freq',
            'grade',
            'kunyomi',
            'onyomi',
            'meanings',
            'meaning_mnemonic',
            'radicals_used',
            'kanji_contained_within_this',
            'main_meanings_to_use'
            # 'vocabulary_that_uses_this'
        ]
        
class JapaneseVocabularySerializer(serializers.ModelSerializer):
    jmdict = JMDictEntriesSerializer()
    kanji_that_this_uses = KanjiComponentSerializer(many=True)
    custom_questions = CustomSubjectQuestionsSerializer(many=True)

    class Meta:
        model = JapaneseVocabulary
        editable=False
        fields = [
            *japanese_subjects_serializer_fields,
            'kanji_that_this_uses',
            'meaning_mnemonic',
            'reading_mnemonic',
            'main_meanings_to_use',
            'main_text_representation',
            'jmdict',
            'custom_questions'
        ]

class GrammarQuestionTranslationSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()
    class Meta:
        model = GrammarQuestionTranslation
        editable = False
        fields = [
            'language',
            'translation'
        ]
    
class GrammarQuestionSerializer(serializers.ModelSerializer):
    translations = GrammarQuestionTranslationSerializer(many=True)
    class Meta:
        model = GrammarQuestion
        editable=False
        fields = [
            'question_type',
            'question_text',
            'translations',
        ]

class GrammarSerializer(serializers.ModelSerializer):
    questions = GrammarQuestionSerializer(many=True)
    examples = SubjectExampleSerializer(many=True)

    class Meta:
        model = Grammar
        editable=False
        fields = [
            *japanese_subjects_serializer_fields,
            'name',
            'meaning',
            'structure',
            'formality',
            'explanation',
            'questions',
            'examples',
            'formality_matters_for_its_questions'
        ]

class SubjectPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Subject: SubjectSerializer,
        JapaneseSubject: JapaneseSubjectSerializer,
        Kana: KanaSerializer,
        JapaneseVocabulary: JapaneseVocabularySerializer,
        Radical: RadicalSerializer,
        Kanji: KanjiSerializer,
        Grammar: GrammarSerializer,
    }
