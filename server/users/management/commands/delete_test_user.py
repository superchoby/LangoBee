from django.core.management.base import BaseCommand, CommandError
from users.models import User

class Command(BaseCommand):
    help = "Delete user before test runs"

    def handle(self, *args, **options):
        if User.objects.filter(username='superfake_username').exists():
            User.objects.get(username='superfake_username').delete()
            self.stdout.write(
                self.style.SUCCESS("Successfully deleted test user")
            )
            return 
        
        self.stdout.write(
            self.style.SUCCESS("No test user to delete")
        )