from django.core.management.base import BaseCommand, CommandError
from users.models import User
from users.serializers import CreateUserSerializer

class Command(BaseCommand):
    help = "Delete user before test runs"

    def handle(self, *args, **options):
        if User.objects.filter(username='superfake_username').exists():
            User.objects.get(username='superfake_username').delete()

        user = CreateUserSerializer(data={
            "email": 'superfake@extremelyfakeemail.com', 
            "username": 'superfake_username', 
            "password": 'superfake_password'
        })
        if user.is_valid():
            user.save()
            test_user = User.objects.get(username='superfake_username')
            test_user.srs_limit = 10000000
            test_user.num_of_subjects_to_teach_per_lesson = 55
            if test_user.subscription is not None:
                user.subscription.delete()
            test_user.stripe_customer_id = None
            test_user.needs_to_update_payment_information = False
            test_user.save()
            self.stdout.write(
                self.style.SUCCESS("Done resetting")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS("Error with resetting test user")
            )
