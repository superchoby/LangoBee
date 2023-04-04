from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course, UsersProgressOnCourse, Language, Article, UsersArticleProgress
from subjects.serializers import JapaneseSubjectSerializer, KanaSerializer, SubjectPolymorphicSerializer
from .serializers import CourseLevelSerializer, ArticleSerializer
from subjects.models import Kanji
from users.models import User
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist

class GetLevelsForLanguagesCourse(APIView):
    def get(self, request, language, course):
        language = Language.objects.get(name=language)
        course = Course.objects.get(language_this_course_teaches=language, name=course)
        users_progress_on_course = UsersProgressOnCourse.objects.get(user=request.user, course=course)
        subjects_remaining_in_this_level = {
            'hiragana': 0,
            'katakana': 0,
            'kanji': 0,
            'grammar': 0,
            'vocabulary': 0,
            'radical': 0
        }
        subjects_already_done_this_level = 0
        for course_level in course.levels.order_by('number')[:users_progress_on_course.current_level.number - 1]:
            for subject in course_level.subjects.all():
                if not request.user.subjects.filter(pk=subject.id).exists():
                    if subject.subject_type != 'grammar':
                        subject_info = JapaneseSubjectSerializer(subject)
                        subject_type = subject_info.data['japanese_subject_type']
                        if subject_type == 'kana':
                            kana_info = KanaSerializer(subject).data
                            subjects_remaining_in_this_level[kana_info['kana_type']] += 1
                        else:
                            subjects_remaining_in_this_level[subject_type] += 1
                    else:
                        subjects_remaining_in_this_level['grammar'] += 1


        for subject in users_progress_on_course.current_level.subjects.all():
            if request.user.subjects.filter(pk=subject.id).exists():
                subjects_already_done_this_level += 1
            else:
                if subject.subject_type != 'grammar':
                    subject_info = JapaneseSubjectSerializer(subject)
                    subject_type = subject_info.data['japanese_subject_type']
                    if subject_type == 'kana':
                        kana_info = KanaSerializer(subject).data
                        subjects_remaining_in_this_level[kana_info['kana_type']] += 1
                    else:
                        subjects_remaining_in_this_level[subject_type] += 1
                else:
                    subjects_remaining_in_this_level['grammar'] += 1
                    
        article_progress = None
        this_levels_article = None
        try:
            this_levels_article = users_progress_on_course.current_level.article
            if this_levels_article:
                article_progress = UsersArticleProgress.objects.get(user=request.user, article=this_levels_article).user_finished_reading_this
        except ObjectDoesNotExist:
            article_progress = False
        
        return Response({
            'subjects_remaining_in_this_level': subjects_remaining_in_this_level,
            'users_current_level': CourseLevelSerializer(users_progress_on_course.current_level).data['number'],
            'subjects_already_done_this_level': subjects_already_done_this_level,
            'all_levels': CourseLevelSerializer(course.levels.all(), many=True).data,
            'user_read_current_levels_article': article_progress,
            'this_levels_article': ArticleSerializer(this_levels_article).data
        })

def get_kanji_data(kanji):
    kanji_obj = Kanji.objects.get(character=kanji)
    return {
        'character': kanji,
        'meanings': kanji_obj.meanings
    }

def sort_vocab_examples_for_kanji(x):
    if x['jlpt_level']:
        return x['jlpt_level']
    else:
        def is_a_common_word(vocab):
            for kanji_vocab in vocab['jmdict']['kanji_vocabulary']:
                if kanji_vocab['common']:
                    return True
                
            for kana_vocab in vocab['jmdict']['kana_vocabulary']:
                if kana_vocab['common']:
                    return True

        x_is_common = is_a_common_word(x)
        if x_is_common:
            return .5
        else:
            return 0

class GetUsersSubjectsForLessons(APIView):
    def get(self, request, course, language):
        language = Language.objects.get(name=language)
        course = Course.objects.get(language_this_course_teaches=language, name=course)
        users_progress_on_course = UsersProgressOnCourse.objects.get(user=request.user, course=course)

        subjects_to_learn = []
        # for course_level in course.levels.order_by('number')[:users_progress_on_course.current_level.number - 1]:
        #     for subject in course_level.subjects.all():
        #         if not request.user.subjects.filter(pk=subject.id).exists():
        #             subjects_to_learn.append(subject)

        subjects_to_learn.extend(users_progress_on_course.current_level.subjects.all().order_by('position_in_course_level'))
        
        subjects_divided_by_type = {
            'kana': [],
            'radical': [],
            'kanji': [],
            'vocabulary': [],
            'grammar': [],
        }

        for subject in subjects_to_learn:
            subjects_divided_by_type[subject.japanese_subject_type if hasattr(subject, 'japanese_subject_type') else subject.subject_type].append(subject)
        
        subjects_arranged_by_type = [
            # *subjects_divided_by_type['kana'],
            # *subjects_divided_by_type['radical'],
            # *subjects_divided_by_type['kanji'],
            *subjects_divided_by_type['vocabulary'],
            # *subjects_divided_by_type['grammar'],
        ]

        subjects_to_send_to_user = []
        for subject in subjects_arranged_by_type:
            if not request.user.subjects.filter(pk=subject.id).exists():
                subjects_to_send_to_user.append(subject)

            reached_num_of_cards_to_teach_in_one_lesson_limit = len(subjects_to_send_to_user) >= request.user.num_of_subjects_to_teach_per_lesson
            reached_srs_limit = len(subjects_to_send_to_user) + request.user.srs_subjects_added_today >= request.user.srs_limit
            if reached_num_of_cards_to_teach_in_one_lesson_limit or reached_srs_limit:
                break

        subjects_to_teach = SubjectPolymorphicSerializer(subjects_to_send_to_user, many=True).data

        for subject in subjects_to_teach:
            if 'japanese_subject_type' in subject:
                if subject['japanese_subject_type'] == 'kanji':
                    subject['kanji_contained_within_this'] = map(get_kanji_data, subject['kanji_contained_within_this'])
                    # sort this based on jlpt and then whether or not common word
                    # print(len(subject['vocabulary_that_uses_this']))
                    # subject['vocabulary_that_uses_this'] = sorted(subject['vocabulary_that_uses_this'], key=sort_vocab_examples_for_kanji)[:5]
                elif subject['japanese_subject_type'] == 'radical':
                    # There are often so many results for kanji that use a radical so this helps filter out the obscure kanji
                    kanji_that_uses_this = filter(lambda kanji: kanji['grade'] is not None and kanji['freq'] is not None, subject['kanji_that_uses_this'])
                    kanji_that_uses_this = sorted(kanji_that_uses_this, key=lambda x: [x['grade'], x['stroke_count'], x['freq']])[:4]
                    subject['kanji_that_uses_this'] = kanji_that_uses_this
        # else:
        #     print('invalid')
        #     return Response(subjects_to_teach.errors)

        return Response({
            'subjects_to_teach': subjects_to_teach
        })

class ArticleView(APIView):
    def get(self, request, language, slug):
        language = Language.objects.get(name=language)
        article = Article.objects.get(language=language, slug=slug)
        user = User.objects.get(id=request.user.id)
        user_has_finished_this_article = None
        if user.read_articles.filter(pk=article.id).exists():
            users_progress = UsersArticleProgress.objects.get(user=user, article=article)
            user_has_finished_this_article = users_progress.user_finished_reading_this
        else:
            UsersArticleProgress.objects.create(user=user, article=article, user_finished_reading_this=False)
            user_has_finished_this_article = False

        return Response({
            'article': ArticleSerializer(article).data,
            'user_has_finished_this_article': user_has_finished_this_article
        })

class MarkArticleAsReadView(APIView):
    def get(self, request, language, slug):
        language = Language.objects.get(name=language)
        article = Article.objects.get(language=language, slug=slug)
        user = User.objects.get(id=request.user.id)
        users_progress = UsersArticleProgress.objects.get(user=user, article=article)
        users_progress.user_finished_reading_this = True
        users_progress.save()

        return Response(status=status.HTTP_200_OK)
