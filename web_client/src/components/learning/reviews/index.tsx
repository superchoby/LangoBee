import { useEffect, useState } from 'react'
import axios from 'axios'
import { JapaneseSubjectData } from '../lessons/SubjectTypes'
import { keysToCamel } from 'src/components/shared/keysToCamel'
import { LearningQuizGenerator } from '../LearningQuizGenerator'

/**
 * Handles where the user does their srs reviews,
 * Want to eventually combine much of the functionality
 * into QuizSubsection component
 */
export const Reviews = (): JSX.Element => {
  const [subjectsToReview, changeSubjectsToReview] = useState<(JapaneseSubjectData)[]>([])
  const [subjectsAndTheirInitialReviewInfo, changeSubjectsAndTheirInitialReviewInfo] = useState<{ [subjectId: number]: { level: number, isFastReviewCard: boolean} }>({})

  useEffect(() => {
    axios.get('reviews/')
    .then(res => {
      const reviewsWithCurrentLevel = res.data.reviews.map(({current_level: currentReviewLevel, subject}: any) => (
        keysToCamel(
          {
            ...subject,
            currentReviewLevel: currentReviewLevel.stage
          }
        )
      ))

      const subjectsToLearn: JapaneseSubjectData[] = []
      const subjectsAndReviewInfo: { [subjectId: number]: { level: number, isFastReviewCard: boolean} } = {}
      for (const subject of reviewsWithCurrentLevel) {
        subjectsToLearn.push({
          ...subject,
          subjectId: subject.id
        })

        subjectsAndReviewInfo[subject.id] = {
            level: subject.currentReviewLevel,
            isFastReviewCard: subject.srsType === 'fast'
        }
      }

      changeSubjectsToReview(subjectsToLearn)
      changeSubjectsAndTheirInitialReviewInfo(subjectsAndReviewInfo)
    })
    .catch(err => {

    })
  }, [])

  return (
    <LearningQuizGenerator 
      content={subjectsToReview}
      errorMessage=''
      isCurrentlyDoingLesson={false}
      subjectsAndTheirInitialReviewInfo={subjectsAndTheirInitialReviewInfo}
    />
  )
}