from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Story, UsersProgressOnStory
from .serializers import ReadStorySerializer, StoryListSerializer
from languages.models import Language
from django.core.exceptions import ObjectDoesNotExist
from users.models import User


class StoryListView(APIView):
    def get(self, request, language):
        language = Language.objects.get(name=language)

        return Response(StoryListSerializer(language.stories.all(), many=True).data)

class ReadStoryView(APIView):
    def get(self, request, language, slug):
        language = Language.objects.get(name=language)
        story = Story.objects.get(language=language, slug=slug)
        user = User.objects.get(id=request.user.id)
        if not UsersProgressOnStory.objects.filter(user=user, story=story).exists():
            UsersProgressOnStory.objects.create(user=user, story=story)

        return Response(ReadStorySerializer(story).data)
