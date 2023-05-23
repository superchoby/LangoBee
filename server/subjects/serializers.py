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
    SubjectExampleTranslation,
    JapaneseVocabularyAudioFile,
    JapaneseCounterWord,
    JapaneseCounterWordHowToAskForHowMany,
    JapaneseCounterWordObjects,
    JapaneseCounterWordSpecialNumber,
    AcceptableResponsesButNotWhatLookingFor,
    SubjectsDifferencesExplanation,
    KanjiStrokeNumber,
    KanjiStrokeData
)
from languages.serializers import LanguageSerializer, CourseLevelNumberSerializer
from jmdict.serializers import (
    JMDictEntriesSerializer,
    JmDictEntriesSerializerForVocabDifferences
)
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

class JapaneseVocabularySerializerForDifferences(serializers.ModelSerializer):
    jmdict = JmDictEntriesSerializerForVocabDifferences()
    class Meta:
        model = JapaneseVocabulary
        editable = False
        fields = [
            'id',
            'main_meanings_to_use',
            'main_text_representation',
            'jmdict'
        ]

class SubjectsDifferencesExplanationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectsDifferencesExplanation
        editable = False
        fields = [
            'difference_from_perspective_of_first_subject',
            'difference_from_perspective_of_second_subject',
            'general_difference'
        ]


class KanjiSerializerForDifferences(serializers.ModelSerializer):
    class Meta:
        model = Kanji
        editable=False
        fields = [
            'character',
            'meanings',
        ]

class SubjectPolymorphicDifferencesSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        JapaneseVocabulary: JapaneseVocabularySerializerForDifferences,
        Kanji: KanjiSerializerForDifferences,
    }

class SubjectSerializer(serializers.ModelSerializer):
    differences_explanations = SubjectPolymorphicDifferencesSerializer(many=True)
    class Meta:
        model = Subject
        editable = False
        fields = [
            'position_in_course_level',
            'subject_type',
            'srs_type',
            'has_unique_subject_model',
            'differences_explanations'
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
    'has_unique_subject_model',
    'note'
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
            'custom_questions',
            'audio_file'
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

class VocabularySerializerForDictionary(serializers.ModelSerializer):
    jmdict = JMDictEntriesSerializer()
    course_level = CourseLevelNumberSerializer()

    class Meta:
        model = JapaneseVocabulary
        editable=False
        fields = [
            'jlpt_level',
            'jmdict',
            'course_level'
        ]

class KanjiStrokeNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = KanjiStrokeNumber
        fields = [
            'number',
            'transform',
        ]
        editable = False

class KanjiStrokeDataSerializer(serializers.ModelSerializer):
    kanji_stroke_numbers = KanjiStrokeNumberSerializer(many=True)
    class Meta:
        model = KanjiStrokeData
        fields = [
            'stroke_paths', 
            'kanji_stroke_numbers'
        ]
        editable = False

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
            'main_meanings_to_use',
        ]    

class JapaneseVocabularyAudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = JapaneseVocabularyAudioFile
        editable=False
        fields = [
            'file',
            'last_high_pitch'
        ]

class JapaneseCounterWordHowToAskForHowManySerializer(serializers.ModelSerializer):
    class Meta:
        model = JapaneseCounterWordHowToAskForHowMany
        editable = False
        fields = [
            'characters',
            'reading'
        ]

class JapaneseCounterWordObjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JapaneseCounterWordObjects
        editable = False
        fields = [
            'singular',
            'plural'
        ]

class JapaneseCounterWordSpecialNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = JapaneseCounterWordSpecialNumber
        editable = False
        fields = [
            'number',
            'reading',
            'explanation',
        ]

class JapaneseCounterWordSerializer(serializers.ModelSerializer):
    how_to_ask_for_how_many = JapaneseCounterWordHowToAskForHowManySerializer()
    objects_this_is_used_to_count = JapaneseCounterWordObjectsSerializer(many=True)
    special_numbers = JapaneseCounterWordSpecialNumberSerializer(many=True)

    class Meta:
        model = JapaneseCounterWord
        editable = False
        fields = [
            'character',
            'usage',
            'normal_reading',
            'how_to_ask_for_how_many',
            'objects_this_is_used_to_count',
            'special_numbers'
        ]

class AcceptableResponsesButNotWhatLookingForSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcceptableResponsesButNotWhatLookingFor
        editable = False
        fields = [
            'response',
            'reason',
        ]
            
class JapaneseVocabularySerializer(serializers.ModelSerializer):
    jmdict = JMDictEntriesSerializer()
    kanji_that_this_uses = KanjiComponentSerializer(many=True)
    custom_questions = CustomSubjectQuestionsSerializer(many=True)
    audio_files = JapaneseVocabularyAudioFileSerializer(many=True)
    counter_word_info = JapaneseCounterWordSerializer()
    acceptable_responses_but_not_what_looking_for = AcceptableResponsesButNotWhatLookingForSerializer(many=True)
    differences_explanations = SubjectPolymorphicDifferencesSerializer(many=True)

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
            'custom_questions',
            'audio_files',
            'counter_word_info',
            'acceptable_responses_but_not_what_looking_for',
            'differences_explanations'
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
