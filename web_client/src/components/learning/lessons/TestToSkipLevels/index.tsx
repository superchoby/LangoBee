import { useState, useEffect } from 'react'
import { QuizGenerator } from '../../../shared/QuizGenerator'
import { useParams } from 'react-router-dom'
import { LESSONS_PATH } from 'src/paths'
import { type JapaneseSubjectData, MULTIPLE_CHOICE_TYPE } from 'src/components/learning/lessons/SubjectTypes'
import axios from 'axios'
import shuffle from 'shuffle-array'
import { MultipleChoiceSubject } from 'src/components/learning/lessons/SubjectTypes'

export const TestToSkipLevels = (): JSX.Element => {
  const { testSlug } = useParams()
  const [testQuestions, changeTestQuestions] = useState<JapaneseSubjectData[]>([])
  const [passedTest, changePassedTest] = useState(false)
  const [subjectsMarkedAsKnown, changeSubjectsMarkedAsKnown] = useState(0)
  const [errorLoadingTestRules, changeErrorLoadingTestResults] = useState(false)

  useEffect(() => {
    if (testSlug != null) {
      axios.get(`languages/tests_to_skip_courses_levels/${testSlug}/`)
        .then(res => {
          const questionDataForQuizGenerator: JapaneseSubjectData[] = []
          for (const { question, answer, wrong_choices: wrongChoices } of shuffle(res.data.custom_questions).slice(0, 2) as any) {
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
            axios.post(`languages/tests_to_skip_courses_levels/${testSlug}/`, { 
              subjects: (correctSubjects as MultipleChoiceSubject[]).map(( {question, answer} ) => ({ question, answer, userKnows: true })),
              score: correctSubjects.length / (correctSubjects.length + incorrectSubjects.length)
            } )
            .then((res) => {
              changePassedTest(res.data['passed'])
              changeSubjectsMarkedAsKnown(res.data['subjects_marked_as_known'])
              changeErrorLoadingTestResults(false)
            })
            .catch(() => {
              changeErrorLoadingTestResults(true)
            })
          }}
          resultsPageInfo={{
            hasIncorrectSection: true,
            leaveButtonLink: LESSONS_PATH,
            leaveButtonText: 'Lessons',
            messageOnTop: 'Results of your test'
          }}
      />
  )
}
