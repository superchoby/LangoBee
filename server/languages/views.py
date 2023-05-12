from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (
    Course, 
    UsersProgressOnCourse, 
    Language, 
    Article, 
    UsersArticleProgress, 
    TestForSkippingACoursesLevels,
    CustomQuestionForTestForSkippingACoursesLevels,
    UsersProgressOnTest,
    CourseLevels
)
from subjects.serializers import (
    JapaneseSubjectSerializer, 
    KanaSerializer, 
    SubjectPolymorphicSerializer, 
    SubjectsDifferencesExplanationSerializer
)
from .serializers import (
    CourseLevelSerializer, 
    ArticleSerializer, 
    TestForSkippingACoursesLevelsSerializer
)
from subjects.models import Kanji, SubjectsDifferencesExplanation
from users.models import User
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from reviews.models import Review
from .test_statuses import (
    PASSED_TEST,
    FAILED_TEST
)

class GetLevelsForLanguagesCourse(APIView):
    def get(self, request, language, course):
        language = Language.objects.get(name=language)
        course = Course.objects.get(language_this_course_teaches=language, name=course)
        users_progress_on_course = UsersProgressOnCourse.objects.get(user=request.user, course=course)

        article_progress = None
        this_levels_article = None
        try:
            this_levels_article = users_progress_on_course.current_level.article
            if this_levels_article:
                article_progress = UsersArticleProgress.objects.get(user=request.user, article=this_levels_article).user_finished_reading_this
        except ObjectDoesNotExist:
            article_progress = False
        
        return Response({
            'users_current_level': CourseLevelSerializer(users_progress_on_course.current_level).data['number'],
            'all_levels': CourseLevelSerializer(course.levels.all(), many=True).data,
            'user_read_current_levels_article': article_progress,
            'this_levels_article': ArticleSerializer(this_levels_article).data
        })
    
class GetRemainingSubjectsForLevel(APIView):
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
        
        return Response({
            'subjects_remaining_in_this_level': subjects_remaining_in_this_level,
            'subjects_already_done_this_level': subjects_already_done_this_level,
        })

def get_kanji_data(kanji):
    kanji_obj = Kanji.objects.get(character=kanji)
    return {
        'character': kanji,
        'meanings': kanji_obj.meanings
    }

# TODO: Check if vocab exmaples are still grabbed
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
        
def get_difference_explanation_for_subjects(first_word, second_word):
    query = Q(first_subject=first_word) | Q(first_subject=second_word ) & Q(second_subject=first_word) | Q(second_subject=second_word)
    difference_explanation = SubjectsDifferencesExplanationSerializer(SubjectsDifferencesExplanation.objects.filter(query), many=True).data
    the_first_instance_is_the_instance_with_written_explanations = difference_explanation[0]['difference_from_perspective_of_first_subject'] is not None or difference_explanation[0]['difference_from_perspective_of_second_subject'] is not None or difference_explanation[0]['general_difference'] is not None
    return difference_explanation[0] if the_first_instance_is_the_instance_with_written_explanations else difference_explanation[1]

class GetUsersSubjectsForLessons(APIView):
    def get(self, request, course, language):
        language = Language.objects.get(name=language)
        course = Course.objects.get(language_this_course_teaches=language, name=course)
        users_progress_on_course = UsersProgressOnCourse.objects.get(user=request.user, course=course)
        subjects_to_learn = []
        for course_level in course.levels.order_by('number')[:users_progress_on_course.current_level.number - 1]:
            for subject in course_level.subjects.all():
                if not request.user.subjects.filter(pk=subject.id).exists():
                    subjects_to_learn.append(subject)

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

        # TODO: Do a thing where the components are checked and if the user hasn't finished the components then
        # they wont' see the subject. I think I'll add a thing called prerequisites instead of just component
        # check because I feel like components woudl be too japanse specific and any lagnauge out there
        # would have prereqs for vocabg and grammar and whateve
        subjects_arranged_by_type = [
            *subjects_divided_by_type['kana'],
            *subjects_divided_by_type['radical'],
            *subjects_divided_by_type['kanji'],
            *subjects_divided_by_type['vocabulary'],
            *subjects_divided_by_type['grammar'],
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
                elif subject['japanese_subject_type'] == 'radical':
                    # There are often so many results for kanji that use a radical so this helps filter out the obscure kanji
                    kanji_that_uses_this = filter(lambda kanji: kanji['grade'] is not None and kanji['freq'] is not None, subject['kanji_that_uses_this'])
                    kanji_that_uses_this = sorted(kanji_that_uses_this, key=lambda x: [x['grade'], x['stroke_count'], x['freq']])[:4]
                    subject['kanji_that_uses_this'] = kanji_that_uses_this
                elif subject['japanese_subject_type'] == 'vocabulary':
                    for i in range(len(subject['differences_explanations'])):
                        difference_explanation = subject['differences_explanations'][i]
                        subject['differences_explanations'][i] = {**difference_explanation, **get_difference_explanation_for_subjects(subject['id'], difference_explanation['id'])}

        return Response({
            'subjects_to_teach': subjects_to_teach
        })

class SpecificArticleView(APIView):
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

class GeneralArticleView(APIView):
    def get(self, request):
        article_data = ArticleSerializer(Article.objects.all(), many=True, context={'get_first_section_only': True}).data
        return Response(article_data)

class MarkArticleAsReadView(APIView):
    def get(self, request, language, slug):
        language = Language.objects.get(name=language)
        article = Article.objects.get(language=language, slug=slug)
        user = User.objects.get(id=request.user.id)
        users_progress = UsersArticleProgress.objects.get(user=user, article=article)
        users_progress.user_finished_reading_this = True
        users_progress.save()

        return Response(status=status.HTTP_200_OK)
    
class TestToSkipCoursesLevelsView(APIView):
    def get(self, request, tests_slug):
        test_user_is_going_to_take = TestForSkippingACoursesLevels.objects.get(slug=tests_slug)
        return Response(TestForSkippingACoursesLevelsSerializer(test_user_is_going_to_take).data, status=status.HTTP_200_OK)
    
    def post(self, request, tests_slug):
        subjects_marked_as_known = 0
        for subject in request.data['subjects']:
            subjects_covered = CustomQuestionForTestForSkippingACoursesLevels.objects.get(
                answer=subject['answer'],
                question=subject['question']
            ).subjects_covered.all()

            subjects_marked_as_known = len(subjects_covered)
            for covered_subject in subjects_covered:
                Review.objects.update_or_create(
                    user=request.user, 
                    subject=covered_subject,
                    user_already_knows_this=True
                )
        
        user_passed_the_test = request.data['score'] < 80
        test = TestForSkippingACoursesLevels.objects.get(slug=tests_slug)
        UsersProgressOnTest.objects.update_or_create(
            user = request.user,
            test = test,
            status = PASSED_TEST if user_passed_the_test else FAILED_TEST
        )

        if user_passed_the_test:
            course_level_to_jump_to = CourseLevels.objects.get(number=test.levels_this_finishes_covering.number + 1, course=test.course)
            request.user.change_level(course_level_to_jump_to.course.language_this_course_teaches, course_level_to_jump_to.course.name, course_level_to_jump_to.number)

        return Response({
            'passed': user_passed_the_test,
            'subjects_marked_as_known': subjects_marked_as_known
        }, status=status.HTTP_200_OK)
