from jamdict import Jamdict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import JapaneseVocabulary, Kanji, Kana
from .serializers import (
    VocabularySerializerForDictionary, 
    KanjiSerializer, 
    KanjiStrokeDataSerializer
)
import json
import re
from romkan import to_hiragana, to_katakana
from reviews.models import Review
from django.utils import timezone

class LookupClass:
    def __init__(self, entries):
        self.entries = entries

def is_all_hiragana_or_katakana(word):
    hiragana_katakana_regex = r'^[\u3040-\u309F\u30A0-\u30FF]*$'
    return bool(re.match(hiragana_katakana_regex, word))

class DictionarySearch(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        jam = Jamdict()
        japanese_regex = r"[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]"
        word_is_japanese = bool(re.search(japanese_regex, request.data['word']))
        word_is_english_and_has_quotes = not word_is_japanese and len(request.data['word']) > 0 and request.data['word'][0] == '"' and request.data['word'][-1] == '"'
        search_results = None
        words_to_search_for = []
        if not word_is_japanese:
            hiragana_version = to_hiragana(request.data['word'])
            if is_all_hiragana_or_katakana(hiragana_version):
                katakana_version = to_katakana(request.data['word'])
                search_results_for_hiragana = jam.lookup(f'{hiragana_version}%', lookup_ne=False, lookup_chars=False)
                search_results_for_katakana = jam.lookup(f'{katakana_version}%', lookup_ne=False, lookup_chars=False)
                search_results = LookupClass([*search_results_for_hiragana.entries, *search_results_for_katakana.entries]) 
                word_is_japanese = True
                words_to_search_for = [hiragana_version, katakana_version]
            else: 
                word_to_search = request.data['word'][1:-1] if word_is_english_and_has_quotes else request.data['word']
                search_results = jam.lookup(f"{word_to_search}{'%' if len(word_to_search) > 2 else ''}")
                words_to_search_for = [word_to_search]
                if len(search_results.entries) == 0:
                    search_results = jam.lookup(f'to {word_to_search}')
                    words_to_search_for = [f'to {word_to_search}']
        else: 
            search_results = jam.lookup(f"{request.data['word']}%", lookup_ne=False)
            words_to_search_for = [request.data['word']]

        word_index_info = {}
        for entry in search_results.entries:
            words_index = None
            word_that_contains_this_word_in_beginning_index = None
            if word_is_japanese:                
                for i in range(len(entry.kanji_forms)):
                    if entry.kanji_forms[i].text in words_to_search_for:
                        words_index = i + 1
                        break
                    elif entry.kanji_forms[i].text.startswith(words_to_search_for[0]) and word_that_contains_this_word_in_beginning_index is None:
                        word_that_contains_this_word_in_beginning_index = i + 1
                
                if words_index is None:
                    for i in range(len(entry.kana_forms)):
                        if entry.kana_forms[i].text in words_to_search_for:
                            words_index = i + 1
                            break
                        elif entry.kana_forms[i].text.startswith(words_to_search_for[0]) and (word_that_contains_this_word_in_beginning_index is None or i < word_that_contains_this_word_in_beginning_index):
                            word_that_contains_this_word_in_beginning_index = i + 1
            else:
                # Find what index the meaning appears in list of meanings, if there is none, find words who's meaning starts with the
                # word the user is searching for as prefix
                for i in range(len(entry.senses)):
                    sense = entry.senses[i]
                    for j in range(len(sense.gloss)):
                        gloss = sense.gloss[j]
                        text = gloss.text
                        if text in words_to_search_for:
                            words_index = (i + 5) + (j + 1)
                            break
                        elif text.startswith(words_to_search_for[0]) and word_that_contains_this_word_in_beginning_index is None:
                            word_that_contains_this_word_in_beginning_index = (i * 5) + (j + 1)

            word_index_info[entry.idseq] = {
                'words_index': words_index,
                'word_that_contains_this_word_in_beginning_index': word_that_contains_this_word_in_beginning_index
            }
                 
        jmdict_common_entries = json.load(open('subjects/common_jmdict_entries.json'))
        def sort_key_func(item):
            index_info = word_index_info[item.idseq]
            words_index = index_info['words_index']
            word_that_contains_this_word_in_beginning_index = index_info['word_that_contains_this_word_in_beginning_index']
            return (str(item.idseq) in jmdict_common_entries, words_index * -1 if words_index is not None else -100, (word_that_contains_this_word_in_beginning_index * -1) if word_that_contains_this_word_in_beginning_index is not None else -100)

        # For some queries with a LOT of entries in the dictionary, such as "shi", there are too many entries to process so code is 
        # really slow at getting all the JapaneseVocabuary instances of them so I process all the data beforehand, filter out everything
        # I don't need and then after that I actually fetch from the DB.
    
        sorted_filtered_data = sorted(search_results.entries, key=sort_key_func, reverse=True)[:20]
        kanji_chars = list(set([char for entry in sorted_filtered_data if len(entry.kanji_forms) > 0 for char in str(entry.kanji_forms[0]) if not is_all_hiragana_or_katakana(char)]))
        list_of_jmdict_ids_to_get  = [entry.idseq for entry in sorted_filtered_data]
        words_data = VocabularySerializerForDictionary(JapaneseVocabulary.objects.filter(jmdict_id__in=list_of_jmdict_ids_to_get), many=True).data
        kanji_data = KanjiSerializer(Kanji.objects.filter(character__in=kanji_chars), many=True).data
        sorted_kanji_data = sorted(kanji_data, key=lambda kanji: kanji_chars.index(kanji['character']))

        # need to sort again cuz when fetching from db, reverts the order of all the fetched stuff back to jmdictID order
        def sort_after_querying(item):
            index_info = word_index_info[item['jmdict']['jm_dict_id']]
            words_index = index_info['words_index']
            word_that_contains_this_word_in_beginning_index = index_info['word_that_contains_this_word_in_beginning_index']
            word_index_sort = words_index * -1 if words_index is not None else -100
            word_that_starts_with_this_word_sort = (word_that_contains_this_word_in_beginning_index * -1) if word_that_contains_this_word_in_beginning_index is not None else -100
            return (str(item['jmdict']['jm_dict_id']) in jmdict_common_entries, word_index_sort, word_that_starts_with_this_word_sort)

        jmdict_tags_human_readable_names = json.load(open('subjects/jmdict_tag_to_human_readable.json'))

        def get_human_readable_tags(tags):
            new_tags = []
            for tag in tags:
                if tag in jmdict_tags_human_readable_names:
                    new_tags.append(jmdict_tags_human_readable_names[tag])
            
            return new_tags

        def update_tags(item):
            jmdict_info = item['jmdict']
            for kanji_word in jmdict_info['kanji_vocabulary']:
                kanji_word['tags'] = get_human_readable_tags(kanji_word['tags'])

            for kana_word in jmdict_info['kana_vocabulary']:
                kana_word['tags'] = get_human_readable_tags(kana_word['tags'])
            
            for sense in jmdict_info['sense']:
                sense['part_of_speech'] = get_human_readable_tags(sense['part_of_speech'])
                sense['field'] = get_human_readable_tags(sense['field'])
                sense['dialect'] = get_human_readable_tags(sense['dialect'])
                sense['misc'] = get_human_readable_tags(sense['misc'])

            return item

        return Response({
            'vocabulary': map(update_tags, sorted(words_data, key=sort_after_querying, reverse=True)),
            'kanji': sorted_kanji_data,
        }, status.HTTP_200_OK)

class AddDictionaryEntryToReviewView(APIView):
    def post(self, request):
        if request.data['subject_type'] in ['vocabulary', 'kanji']:
            subject_to_add = JapaneseVocabulary.objects.get(jmdict_id=request.data['jmdict_id']) if request.data['subject_type'] == 'vocabulary' else Kanji.objects.get(character=request.data['kanji_character'])
            user_already_has_this_in_reviews = request.user.subjects.filter(pk=subject_to_add.id).exists()
            if not user_already_has_this_in_reviews:
                Review.create_brand_new_level_one_review(
                    request.user, 
                    subject_to_add, 
                    False,
                    True
                )

            return Response({
                'user_already_has_this_in_reviews': user_already_has_this_in_reviews
            }, status.HTTP_200_OK)
        else:
            return Response(status.HTTP_400_BAD_REQUEST)

class CharacterStrokeDataView(APIView):
    def get(self, request, char):
        try:
            if ()
            return Response(
                KanjiStrokeDataSerializer(Kanji.objects.get(character=char).stroke_data).data, 
                status=status.HTTP_200_OK
            )
        except Kanji.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)