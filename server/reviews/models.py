from django.db import models
from django.contrib.auth import get_user_model
from datetime import timedelta
from django.utils import timezone
from enum import Enum

class SpaceRepetitionSystems(Enum):
    FAST = 'fast'
    DEFAULT = 'default'

spaced_repetition_system_names = [
    (SpaceRepetitionSystems.FAST.value, 'system for easy subjects'),
    (SpaceRepetitionSystems.DEFAULT.value, 'system for all other subjects')
]

srsStages = [
    (1, '1st level'),
    (2, '2nd level'),
    (3, '3rd level'),
    (4, '4th level'),
    (5, 'Final level for quick subjects'),
    (6, '6th level'),
    (7, '7th level'),
    (8, '8th level'),
    (9, 'Final level for normal subjects'),
]

timeUntilNextReviewChoices = [
    (2, '2 hours'),
    (4, '4 hours'),
    (8, '8 hours'),
    (24, '1 day'),
    (48, '2 days'),
    (168, '1 week'),
    (336, '2 weeks'),
    (720, '1 month'),
    (2880, '4 months'),
]

class SpacedRepetitionSystemManager(models.Manager):
    def get_by_natural_key(self, name):
        return self.get(name=name)

class SpacedRepetitionSystem(models.Model):
    finished_position = models.PositiveIntegerField(choices=[(5, 5), (9, 9)])
    name = models.CharField(max_length=7, choices=spaced_repetition_system_names, primary_key=True)

    objects = SpacedRepetitionSystemManager()

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.name)

class SpacedRepetitionSystemStages(models.Model):
    stage = models.PositiveIntegerField(choices=srsStages)
    # in hours
    time_until_next_review = models.PositiveIntegerField(choices=timeUntilNextReviewChoices, null=True)
    system_this_belongs_to = models.ForeignKey(SpacedRepetitionSystem, on_delete=models.CASCADE, related_name='stages')

    def __str__(self):
        return f'{self.stage}'

class Review(models.Model):
    subject=models.ForeignKey('subjects.Subject', on_delete=models.CASCADE)
    current_level=models.ForeignKey(SpacedRepetitionSystemStages, null=True, on_delete=models.SET_NULL)
    next_review_date=models.DateTimeField(null=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, to_field='uuid', db_column='user_uuid', related_name='reviews')
    user_already_knows_this = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=True)
    already_answered_reading_correctly = models.BooleanField(default=False)
    already_answered_meaning_correctly = models.BooleanField(default=False)
    times_got_reading_incorrect = models.PositiveIntegerField(default=0)
    times_got_meaning_incorrect = models.PositiveIntegerField(default=0)
    times_user_attempted_reading = models.PositiveIntegerField(default=0)
    times_user_attempted_meaning = models.PositiveIntegerField(default=0)
    times_this_was_completed = models.PositiveBigIntegerField(default=0)

    @classmethod
    def create_brand_new_level_one_review(cls, user, subject, is_fast_review_card, review_now):        
        srs_system_name = (SpaceRepetitionSystems.FAST if is_fast_review_card else SpaceRepetitionSystems.DEFAULT).value
        srs_system = SpacedRepetitionSystem.objects.get(name=srs_system_name) 

        instance = cls.objects.create(
            user=user, 
            subject=subject,
            next_review_date=timezone.now() if review_now else timezone.now() + timedelta(hours=subject.srs_type.stages.get(stage=1).time_until_next_review),
            current_level=SpacedRepetitionSystemStages.objects.get(
                stage=1, 
                system_this_belongs_to=srs_system,
            )
        )

        return instance

    class Meta:
        ordering = ('next_review_date',)
