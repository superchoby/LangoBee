from django.db import models
from django.contrib.postgres.fields import ArrayField
from languages.models import Language, CourseLevels
from polymorphic.models import PolymorphicModel
from polymorphic.managers import PolymorphicManager
from django.contrib.auth import get_user_model

class Subject(PolymorphicModel):
    subject_types = [
        ('alphabet', 'alphabet'),
        ('vocabulary', 'vocabulary'),
        ('grammar', 'grammar')
    ]
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, related_name='subjects', null=True)
    course = models.ForeignKey('languages.Course', on_delete=models.SET_NULL, related_name='subjects', null=True)
    course_level = models.ForeignKey(CourseLevels, on_delete=models.SET_NULL, related_name='subjects', null=True)
    position_in_course_level = models.PositiveIntegerField(null=True)
    subject_type = models.CharField(max_length=max([len(subject_type[0]) for subject_type in subject_types]), choices=subject_types)
    srs_type = models.ForeignKey('reviews.SpacedRepetitionSystem', on_delete=models.SET_NULL, null=True)
    has_unique_subject_model = models.BooleanField(default=False)
    users = models.ManyToManyField(get_user_model(), through='reviews.Review', related_name='subjects')
    note = models.TextField(null=True)

class CustomSubjectQuestions(models.Model):
    question = models.CharField(max_length=20)
    answers = ArrayField(models.CharField(max_length=20), default=list)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='custom_questions')

    def __str__(self):
        return self.question

class JapaneseSubject(Subject, PolymorphicModel):
    japanese_subject_types = [
        ('kana', 'kana'),
        ('radical', 'radical'),
        ('kanji', 'kanji'),
        ('vocabulary', 'vocabulary'),
        ('grammar', 'grammar')
    ]
    jlpt_levels = [
        (5, 'JLPT N5'),
        (4, 'JLPT N4'),
        (3, 'JLPT N3'),
        (2, 'JLPT N2'),
        (1, 'JLPT N1'),
    ]
    jlpt_level = models.IntegerField(choices=jlpt_levels, null=True)
    japanese_subject_type = models.CharField(max_length=max([len(subject_type[0]) for subject_type in japanese_subject_types]), choices=japanese_subject_types)

class KanaAndRadicalBase(models.Model):
    image_content_type_choices = [
        ('image/png', 'png'), 
        ('image/svg+xml', 'svg'), 
        ('', 'does not exist')
    ]
    mnemonic_explanation = models.TextField(default='', null=True)
    mnemonic_image = models.TextField(default='', null=True)
    mnemonic_image_content_type=models.TextField(max_length=13, choices=image_content_type_choices)

    class Meta:
        abstract = True

class KanaManager(PolymorphicManager):
    def get_by_natural_key(self, character):
        return self.get(character=character)

# Create your models here.
class Kana(KanaAndRadicalBase, JapaneseSubject):
    character = models.CharField(max_length=7, unique=True)
    reading = models.CharField(max_length=20)
    kana_type = models.CharField(max_length=8, choices=[('hiragana', 'hiragana'), ('katakana', 'katakana')])
    pronunciation_note = models.CharField(max_length=150, null=True)
    is_special_kana = models.BooleanField(default=False)
    special_kana_explanation = models.TextField(null=True)
    audio_file = models.TextField(null=True)

    objects = KanaManager()

    def __str__(self):
        return self.character

    def natural_key(self):
        return (self.character)

class RadicalManager(PolymorphicManager):
    def get_by_natural_key(self, character):
        return self.get(character=character)

class Radical(KanaAndRadicalBase, JapaneseSubject):
    character = models.CharField(max_length=1, unique=True)
    meaning = models.CharField(max_length=20)

    objects = RadicalManager()
    
    def __str__(self):
        return self.character

    def natural_key(self):
        return self.character

class KanjiManager(PolymorphicManager):
    def get_by_natural_key(self, character):
        return self.get(character=character)

class Kanji(JapaneseSubject):
    character = models.CharField(max_length=1, unique=True)
    stroke_count = models.PositiveIntegerField()
    freq = models.PositiveIntegerField(null=True, unique=True)
    grade = models.PositiveIntegerField(null=True)
    kunyomi = ArrayField(models.CharField(max_length=10), default=list)
    onyomi = ArrayField(models.CharField(max_length=10), default=list)
    meanings = ArrayField(models.CharField(max_length=100))
    main_meanings_to_use=ArrayField(models.CharField(max_length=20), default=list)
    meaning_mnemonic = models.TextField(default='')
    radicals_used = models.ManyToManyField(Radical, related_name='kanji_that_uses_this')
    kanji_contained_within_this = ArrayField(models.CharField(max_length=1), default=list)

    objects = KanjiManager()

    def __str__(self):
        return self.character

    def natural_key(self):
        return self.character

class JapaneseVocabulary(JapaneseSubject):
    kanji_that_this_uses = models.ManyToManyField(Kanji, related_name='vocabulary_that_uses_this')
    meaning_mnemonic = models.TextField(null=True)
    reading_mnemonic = models.TextField(null=True)
    main_meanings_to_use = ArrayField(models.CharField(max_length=20), default=list)
    main_text_representation = models.CharField(null=True, max_length=30)
    is_a_counter_word = models.BooleanField(default=False)
    jmdict = models.OneToOneField('jmdict.JMDictEntries', on_delete=models.SET_NULL, null=True)

class JapaneseVocabularyAudioFile(models.Model):
    file = models.TextField()
    last_high_pitch = models.PositiveIntegerField(null=True)
    vocabulary = models.ForeignKey(JapaneseVocabulary, on_delete=models.CASCADE, related_name='audio_files')

class CustomJapaneseVocabularyQuestions(models.Model):
    vocabulary = models.ForeignKey(JapaneseVocabulary, on_delete=models.CASCADE)

class GrammarManager(PolymorphicManager):
    def get_by_natural_key(self, name, meaning):
        return self.get(name=name, meaning=meaning)

class Grammar(JapaneseSubject):
    formality_levels = [
        ('丁寧語', 'Polite'),
        ('尊敬語', 'Honorific'),
        ('謙譲語', 'Humble'),
        ('casual', 'Casual'),
        ('very casual', 'Very casual'),
        ('standard', 'Used in any case')
    ]
    name = models.CharField(max_length=150, unique=True)
    meaning = models.CharField(max_length=150)
    structure = models.CharField(max_length=150)
    formality = models.CharField(choices=formality_levels, max_length=max(len(level[0]) for level in formality_levels))
    explanation = models.TextField()
    formality_matters_for_its_questions = models.BooleanField(default=False)

    objects = GrammarManager()

    def __str__(self):
        return f'{self.name} {self.meaning}'

    def natural_key(self):
        return (self.name, self.meaning)

class GrammarQuestion(models.Model):
    grammarQuestionTypes = [
        ('fill in blank', 'fill in blank question'),
        ('build sentence', 'build a sentence given word bank')
    ]
    question_type = models.CharField(max_length=max([len(qType[0]) for qType in grammarQuestionTypes]), choices=grammarQuestionTypes)
    grammar_point = models.ForeignKey(Grammar, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()

    def __str__(self):
        return self.question_text

class GrammarQuestionTranslation(models.Model):
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, related_name='language_grammar_questions_translation')
    translation = models.TextField()
    grammar_question = models.ForeignKey(GrammarQuestion, on_delete=models.CASCADE, related_name='translations')

class SubjectExample(models.Model):
    example_text = models.TextField()
    audio_file = models.CharField(max_length=150, null=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='examples')

    def __str__(self):
        return self.example_text

class SubjectExampleTranslation(models.Model):
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, related_name='language_example_translation')
    translation = models.TextField()
    subject_example = models.ForeignKey(SubjectExample, on_delete=models.CASCADE, related_name='translations')

    def __str__(self):
        return self.translation

class SubjectExampleTranslationExplanation(models.Model):
    explanation = models.TextField()
    translation_being_explained = models.ForeignKey(SubjectExampleTranslation, on_delete=models.CASCADE, related_name='explanations')
