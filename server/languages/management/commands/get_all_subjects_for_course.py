from django.core.management.base import BaseCommand, CommandError
from languages.models import Course, Language
from subjects.serializers import SubjectPolymorphicSerializer
import json

class Command(BaseCommand):
    help = "Get all of a course's subjects and write it to a JSON file"

    def add_arguments(self, parser):
        parser.add_argument("language", nargs="+", type=str)
        parser.add_argument("course_name", nargs="+", type=str)

    def handle(self, *args, **options):
        language = Language.objects.get(name=options["language"][0])
        course = Course.objects.get(language_this_course_teaches=language, name=options["course_name"][0])
        subject_json = json.dumps(SubjectPolymorphicSerializer(course.subjects.all(), many=True).data, indent=4)
        # Writing to sample.json
        with open("AllOfCoursesSubjectsData.json", "w") as outfile:
            outfile.write(subject_json)
