import {
  LEARNING_TYPE,
  GENERAL_CONCEPT_TYPE,
  QUIZ_TYPE
} from '../../../../context/JapaneseDatabaseContext/SharedVariables'
import './index.scss'
import { useState, useEffect, useMemo } from 'react'
import { LessonLearning } from './LessonLearning'
import { useAppDispatch } from 'src/app/hooks'
import axios from 'axios'
import { QuizGenerator } from '../../../shared/QuizGenerator'
import ClipLoader from 'react-spinners/ClipLoader'
import { JapaneseSubjectData } from '../SubjectTypes'
import { userAddedMoreSubjectsToReview } from '../../../../app/userSlice'
import { keysToCamel } from 'src/components/shared/keysToCamel'
import { LearningQuizGenerator } from '../../LearningQuizGenerator'

export const getSubheader = (conceptBeingLearned: GENERAL_CONCEPT_TYPE, currentPage: typeof LEARNING_TYPE | typeof QUIZ_TYPE): string => {
  if (currentPage === LEARNING_TYPE) {
    return `This Lesson's ${conceptBeingLearned}`
  } else if (conceptBeingLearned === '') {
    return ''
  } else {
    return 'Free Response Quiz'
  }
}

/**
 * Handles all things when user learns new concepts
 * from the learning them to the first time stage to
 * quizzing them and adding the concept to their list of cards
 * once the user gets it right
 */
export const LessonSession = (): JSX.Element => {
  const [currentPage, changeCurrentPage] = useState<typeof LEARNING_TYPE | typeof QUIZ_TYPE>(LEARNING_TYPE)
  const [subjectsForLessonHasBeenFetched, changeSubjectsForLessonHasBeenFetched] = useState(false)
  const [subjectsToLearn, changeSubjectsToLearn] = useState<JapaneseSubjectData[]>([])
  const [errorWithUpdatingUsersProgress, changeErrorWithUpdatingUsersProgress] = useState(false)
  const [userCompletedLevel, changeUserCompletedLevel] = useState(false)
  const [subjectsAndTheirInitialReviewInfo, changeSubjectsAndTheirInitialReviewInfo] = useState<{ [subjectId: number]: { level: number, isFastReviewCard: boolean} }>({})

  useEffect(() => {
    axios.get('/languages/lesson_session/Japanese/main/')
    .then(res => {
      const {
        subjects_to_teach
      } = res.data
      const subjects = subjects_to_teach.map((subject: any) => keysToCamel(subject))
      const subjectsToLearn: JapaneseSubjectData[] = []
      const subjectsAndReviewInfo: { [subjectId: number]: { level: number, isFastReviewCard: boolean} } = {}
      for (const subject of subjects) {
        subjectsToLearn.push({
          ...subject,
          subjectId: subject.id,
          hasUniqueSubjectModel: subject.hasUniqueSubjectModel,
          subjectType: subject.subjectType,
        })

        subjectsAndReviewInfo[subject.id] = {
            level: 0,
            isFastReviewCard: subject.srsType === 'fast'
        }
      }



      changeSubjectsToLearn(subjectsToLearn)
      changeSubjectsAndTheirInitialReviewInfo(subjectsAndReviewInfo)
      changeSubjectsForLessonHasBeenFetched(true)
    })
    .catch(err => {
      console.error(err)
    })
  }, [])

  const completionMessage = `You have completed the quiz${userCompletedLevel ? ' and the whole level!' : ''}! That's +${subjectsToLearn.length * 5} points!`

  const quizContents = useMemo(() => (
    subjectsToLearn.map(subject => ({...subject, currentReviewLevel: 0}))
  ), [subjectsToLearn])

  return (
        <div>
            <div>
                {
                  subjectsForLessonHasBeenFetched ? 
                  (
                    currentPage === LEARNING_TYPE
                      ? 
                        (Object.keys(subjectsToLearn).length > 0 && 
                          <LessonLearning
                            subjectsToTeach={subjectsToLearn}
                            startQuiz={() => { changeCurrentPage(QUIZ_TYPE) }}
                          />
                        )
                      : (
                          <LearningQuizGenerator 
                            content={subjectsToLearn}
                            errorMessage=''
                            isCurrentlyDoingLesson={true}
                            subjectsAndTheirInitialReviewInfo={subjectsAndTheirInitialReviewInfo}
                          />
                        )
                )
                : 
                <div className='lessons-session-loading-msg'>
                  <ClipLoader />
                  Loading the lesson
                </div>
                }
                
            </div>
        </div>
  )
}
