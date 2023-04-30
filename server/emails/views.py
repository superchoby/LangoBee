from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView

# Create your views here.
class ContactUsView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        subject = f'Question about {request.data["subject"]}'
        message = f'{request.data["email"]} is trying to contact you saying: \n\n {request.data["message"]}'
        email_from = request.data["email"]
        recipient_list = ['contact@langobee.com']
        try:
            send_mail( subject, message, email_from, recipient_list)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    