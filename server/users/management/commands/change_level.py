from django.core.management.base import BaseCommand, CommandError
from users.models import User

class Command(BaseCommand):
    help = "Get all of a course's subjects and write it to a JSON file"

    def add_arguments(self, parser):
        parser.add_argument("language", nargs="+", type=str)
        parser.add_argument("course_name", nargs="+", type=str)
        parser.add_argument("level", nargs="+", type=int)

    def handle(self, *args, **options):
        test_user = User.objects.get(username='superfake_username')
        test_user.change_level(options["language"][0],options["course_name"][0],options["level"][0])
        self.stdout.write(
            self.style.SUCCESS("Changed Level")
        )
