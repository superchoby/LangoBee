import { useState, useEffect } from 'react'
import { QuizGenerator } from '../../../shared/QuizGenerator'
import { useParams } from 'react-router-dom'
import { LESSONS_PATH } from 'src/paths'
import { type JapaneseSubjectData, MULTIPLE_CHOICE_TYPE } from 'src/components/learning/lessons/SubjectTypes'
import axios from 'axios'

// type CourseLevel = {
//     testThatEndsHere: {
//       textToEncourageUserToTake: string
//       slug: string
//     } | null
// }

export const TestToSkipLevels = (): JSX.Element => {
  const { testSlug } = useParams()
  const [testQuestions, changeTestQuestions] = useState<JapaneseSubjectData[]>([])

  useEffect(() => {
    if (testSlug != null) {
      axios.get(`languages/tests_to_skip_courses_levels/${testSlug}/`)
        .then(res => {
          const questionDataForQuizGenerator: JapaneseSubjectData[] = []
          for (const { question, answer, wrong_choices: wrongChoices } of res.data.custom_questions) {
            questionDataForQuizGenerator.push({
              question,
              answer,
              questionPrompt: 'Select the correct answer',
              subjectId: question,
              hasUniqueSubjectModel: true,
              subjectType: MULTIPLE_CHOICE_TYPE,
              infoToDisplay: [],
              wrongChoices,
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
            onCompletedAllSubjectsQuestions={() => {
              throw new Error('go and add a onCompletedAllSubjectsQuestions function')
            }}
            separateCorrectAndIncorrectSubjects={true}
            resultsPageInfo={{
              hasIncorrectSection: true,
              leaveButtonLink: LESSONS_PATH,
              leaveButtonText: 'Lessons',
              messageOnTop: 'Results of your test'
            }}
        />
  )
}
