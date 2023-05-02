import './index.scss'

interface ReviewsAndLessonsStatisticProps {
  statisticBeingTold: 'Reviews' | 'Lessons'
  number: number
}

const ReviewsAndLessonsStatistic = ({
  statisticBeingTold,
  number
}: ReviewsAndLessonsStatisticProps) => {
  return (
        <div className='reviews-and-lessons-statistic-container'>
            <h2 className='reviews-and-lessons-statistic-header'>Total {statisticBeingTold} Completed</h2>
            <span className={`reviews-and-lessons-statistic-number reviews-and-lessons-statistic-number-${statisticBeingTold === 'Lessons' ? 'green' : 'purple'}`}>{number}</span>
        </div>
  )
}

interface ReviewsLessonsTrackerProps {
  lessonsCompleted: number
  reviewsCompleted: number
}

export const ReviewsLessonsTracker = ({
  lessonsCompleted,
  reviewsCompleted
}: ReviewsLessonsTrackerProps) => {
  return (
        <div className='reviews-lessons-tracker-container'>
            <ReviewsAndLessonsStatistic
                statisticBeingTold='Lessons'
                number={lessonsCompleted}
            />

            <ReviewsAndLessonsStatistic
                statisticBeingTold='Reviews'
                number={reviewsCompleted}
            />
        </div>
  )
}
