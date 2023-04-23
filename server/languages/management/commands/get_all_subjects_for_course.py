from django.core.management.base import BaseCommand, CommandError
from languages.models import Course, Language
from subjects.serializers import SubjectPolymorphicSerializer
import json
import os

DIRECTORY_NAME = 'AllOfCoursesSubjectsDataPreConvert'

class Command(BaseCommand):
    help = "Get all of a course's subjects up divided by levels and writes it to a JSON file"

    def add_arguments(self, parser):
        parser.add_argument("language", nargs="+", type=str)
        parser.add_argument("course_name", nargs="+", type=str)

    def getSubjectsJsonDataFromLastTwentyLevels(self, language, course, endingLevel):
        language = Language.objects.get(name=language)
        course = Course.objects.get(language_this_course_teaches=language, name=course)
        subjects = []
        for level in course.levels.all()[:endingLevel]:
            for subject in level.subjects.all():
                subjects.append(subject)
        
        return json.dumps(SubjectPolymorphicSerializer(subjects, many=True).data)

    def handle(self, *args, **options):
        if not os.path.exists(DIRECTORY_NAME):
            os.makedirs(DIRECTORY_NAME)
        for level in [20,40,60,80,100,120,140,160,180]:
            subject_json = self.getSubjectsJsonDataFromLastTwentyLevels(options["language"][0], options["course_name"][0], level)

            with open(f'{DIRECTORY_NAME}/AllOfCoursesSubjectsDataUpToLv{level}.json', "w") as outfile:
                outfile.write(subject_json)

            self.stdout.write(
                self.style.SUCCESS(f"Done Processing up to Level {level}")
            )
