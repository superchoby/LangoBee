import { useState, useEffect } from 'react'
import { QuizGenerator } from '../../../shared/QuizGenerator'
import { useParams } from 'react-router-dom'
import { LESSONS_PATH } from 'src/paths'
import { JapaneseSubjectData, MULTIPLE_CHOICE_TYPE } from 'src/components/learning/lessons/SubjectTypes'
import axios from 'axios'
import shuffle from 'shuffle-array'
import { MultipleChoiceSubject } from 'src/components/learning/lessons/SubjectTypes'
import { 
  FETCHED_DATA_ERROR,
  FETCHED_DATA_SUCCESS,
  FETHCED_DATA_PROCESSING,
  FETCH_TYPE
} from 'src/components/shared/values'

export const TestToSkipLevels = (): JSX.Element => {
  const { testSlug } = useParams()
  const [testQuestions, changeTestQuestions] = useState<JapaneseSubjectData[]>([])
  const [passedTest, changePassedTest] = useState(false)
  const [loadingTestResults, changeLoadingTestResults] = useState<FETCH_TYPE | null>(null)
  const [gotAtLeastOneQuestionRight, changeGotAtLeastOneQuestionRight] = useState(false)

  const resultsPageMessage = passedTest ? (
    "Congratulations on passing the test! You've now jumped ahead a few levels!"
  ) : (
    gotAtLeastOneQuestionRight ? (
      "Unfortunately you didn't pass the test but for the questions you got right, we took note of that so now you can skip those concepts! If you see anymore that you know of during your lessons, you can always press the 'Already Know' button to skip it!"
    ) : (
      "Unfortunately you didn't pass the test but you can always skip any subject you see in the lessons by pressing the 'Already Know' button!"
    )
  )

  useEffect(() => {
    if (testSlug != null) {
      axios.get(`languages/tests_to_skip_courses_levels/${testSlug}/`)
        .then(res => {
          const questionDataForQuizGenerator: JapaneseSubjectData[] = []
          for (const { question, answer, wrong_choices: wrongChoices } of shuffle(res.data.custom_questions).slice(0, 10) as any) {
            questionDataForQuizGenerator.push({
              question,
              answer,
              questionPrompt: 'Select the correct answer',
              subjectId: question,
              hasUniqueSubjectModel: true,
              subjectType: MULTIPLE_CHOICE_TYPE,
              infoToDisplay: [],
              wrongChoices: wrongChoices.map(({ text }: any) => text),
              japaneseSubjectType: MULTIPLE_CHOICE_TYPE
            })
          }
          changeTestQuestions(questionDataForQuizGenerator)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }, [testSlug])

  return (
      <QuizGenerator
          content={testQuestions}
          errorMessage=''
          separateCorrectAndIncorrectSubjects={true}
          testMode={true}
          onDoneWithQuiz={(correctSubjects, incorrectSubjects) => {
            changeLoadingTestResults(FETHCED_DATA_PROCESSING)
            axios.post(`languages/tests_to_skip_courses_levels/${testSlug}/`, { 
              subjects: (correctSubjects as MultipleChoiceSubject[]).map(( {question, answer} ) => ({ question, answer, userKnows: true })),
              score: correctSubjects.length / (correctSubjects.length + incorrectSubjects.length)
            } )
            .then((res) => {
              changePassedTest(res.data['passed'])
              changeLoadingTestResults(FETCHED_DATA_SUCCESS)
              changeGotAtLeastOneQuestionRight(correctSubjects.length > 0)
            })
            .catch(() => {
              changeLoadingTestResults(FETCHED_DATA_ERROR)
            })
          }}
          showLoadingResultsMessage={loadingTestResults === FETHCED_DATA_PROCESSING}
          resultsPageInfo={{
            hasIncorrectSection: true,
            leaveButtonLink: LESSONS_PATH,
            leaveButtonText: 'Lessons',
            messageOnTop: loadingTestResults === FETCHED_DATA_ERROR ? 'Sorry, there was an error processing your test results at the moment. We will get to it as soon as we can.' : resultsPageMessage
          }}
      />
  )
}
