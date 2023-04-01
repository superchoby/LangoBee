from rest_framework.views import APIView
from rest_framework.response import Response
from languages.models import Language, Course, UsersProgressOnCourse
from .serializers import SubjectPolymorphicSerializer
# Create your views here.
