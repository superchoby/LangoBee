from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from .serializers import CreateUserSerializer

@receiver(user_signed_up)
def user_signed_up_(request, user, **kwargs):
    # actions to perform after a user signs up
    print(request)
    print(user)
    serializer = CreateUserSerializer(user, data={}, partial=True)
    if serializer.is_valid():
        serializer.save()

    # DO SOMETHING WITH THIS SIGNAL HANDLER
    print(f'User {user.username} signed up')