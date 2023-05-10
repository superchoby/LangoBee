from .models import JMDictEntries



from rest_framework.views import APIView
from rest_framework.response import Response
import json
from rest_framework import permissions


for entries in JMDictEntries.objects.all():
    for kanji in entries.kanji_vocabulary.all():
        kanji.text.split()

    for kana in entries.kana_vocabulary.all():
        kana.text.split()

print('HEYHEYHEYHEYHEY')


class JMDictSearch(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(json.dumps(PRICES_INFO, cls=EnhancedJSONEncoder))
