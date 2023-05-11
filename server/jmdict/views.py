from .jamdict import Jamdict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from subjects.models import JapaneseVocabulary
from subjects.serializers import VocabularySerializerForDictionary
import json
import re
from romkan import to_hiragana, to_katakana

class LookupClass:
    def __init__(self, entries):
        self.entries = entries

def is_all_hiragana_or_katakana(word):
    hiragana_katakana_regex = r'^[\u3040-\u309F\u30A0-\u30FF]*$'
    return bool(re.match(hiragana_katakana_regex, word))

class JMDictSearch(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        jam = Jamdict()
        japanese_regex = r"[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]"
        word_is_japanese = bool(re.search(japanese_regex, request.data['word']))
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
                search_results = jam.lookup(request.data['word'], lookup_ne=False)
                words_to_search_for = [request.data['word']]
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
                        words_index = i
                        break
                    elif entry.kanji_forms[i].text.startswith(request.data['word'][0]) and word_that_contains_this_word_in_beginning_index is None:
                        word_that_contains_this_word_in_beginning_index = i
                
                if words_index is None:
                    for i in range(len(entry.kana_forms)):
                        if entry.kana_forms[i].text in words_to_search_for:
                            words_index = i
                            break
                        elif entry.kana_forms[i].text.startswith(request.data['word'][0]) and (word_that_contains_this_word_in_beginning_index is None or i < word_that_contains_this_word_in_beginning_index):
                            word_that_contains_this_word_in_beginning_index = i
            else:
                # Find what index the meaning appears in list of meanings, if there is none, find words who's meaning starts with the
                # word the user is searching for as prefix
                for i in range(len(entry.senses)):
                    sense = entry.senses[i]
                    for j in range(len(sense.get('gloss'))):
                        gloss = sense.get('gloss')[j]
                        text = gloss.get('text')
                        if text in words_to_search_for:
                            words_index = (i + 1) * (j + 1)
                            break
                        elif text.startswith(request.data['word'][0]) and word_that_contains_this_word_in_beginning_index is None:
                            word_that_contains_this_word_in_beginning_index = (i + 1) * (j + 1)

            word_index_info[entry.idseq] = {
                'words_index': words_index,
                'word_that_contains_this_word_in_beginning_index': word_that_contains_this_word_in_beginning_index
            }
                
        def get_sort_tuple(jmdict_id):
            index_info = word_index_info[jmdict_id]
            words_index = index_info['words_index']
            word_that_contains_this_word_in_beginning_index = index_info['word_that_contains_this_word_in_beginning_index']
            return (words_index * -1 if words_index is not None else -100, str(jmdict_id) in jmdict_common_entries, (word_that_contains_this_word_in_beginning_index * -1) if word_that_contains_this_word_in_beginning_index is not None else -100)
        
        jmdict_common_entries = json.load(open('jmdict/common_jmdict_entries.json'))
        def sort_key_func(item):
            return get_sort_tuple(item.idseq)

        # For some queries with a LOT of entries in the dictionary, such as "shi", there are too many entries to process so code is 
        # really slow at getting all the JapaneseVocabuary instances of them so I process all the data beforehand, filter out everything
        # I don't need and then after that I actually fetch from the DB.
    
        sorted_filtered_data = sorted(search_results.entries, key=sort_key_func, reverse=True)
        list_of_jmdict_ids_to_get  = [entry.idseq for entry in sorted_filtered_data[:20]]
        words_data = VocabularySerializerForDictionary(JapaneseVocabulary.objects.filter(jmdict_id__in=list_of_jmdict_ids_to_get), many=True).data

        # need to sort again cuz when fetching from db, reverts the order of all the fetched stuff back to jmdictID order
        def sort_after_querying(item):
            return get_sort_tuple(item['jmdict']['jm_dict_id'])

        jmdict_tags_human_readable_names = json.load(open('jmdict/jmdict_tag_to_human_readable.json'))

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

        return Response(map(update_tags, sorted(words_data, key=sort_after_querying, reverse=True)), status.HTTP_200_OK)

