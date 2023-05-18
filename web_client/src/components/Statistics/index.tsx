import { ReviewsLessonsTracker } from './ReviewsLessonsTracker'
import { JLPTContentCovered, JLPTStats } from './JLPTContentCovered'
import { HOME_PATH, STATISTICS_PATH } from 'src/paths'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.scss'

const DEFAULT_COMPLETED_SUBJECTS_BY_JLPT_LEVEL = {
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0
}

interface UsersStatsRes {
  lessons_completed: number
  reviews_completed: number
  completed_kanji_levels: JLPTStats
  completed_vocab_levels: JLPTStats
  completed_grammar_levels: JLPTStats
}

export const StatisticsSection = (): JSX.Element => {
  const [lessonsCompleted, changeLessonsCompleted] = useState(0)
  const [reviewsCompleted, changeReviewsCompleted] = useState(0)
  const [completedKanjiLevels, changeCompletedKanjiLevels] = useState<JLPTStats>(DEFAULT_COMPLETED_SUBJECTS_BY_JLPT_LEVEL)
  const [completedVocabLevels, changeCompletedVocabLevels] = useState<JLPTStats>(DEFAULT_COMPLETED_SUBJECTS_BY_JLPT_LEVEL)
  const [completedGrammarLevels, changeCompletedGrammarLevels] = useState<JLPTStats>(DEFAULT_COMPLETED_SUBJECTS_BY_JLPT_LEVEL)

  useEffect(() => {
    axios.post('users/get-users-stats/', { language: 'Japanese' })
      .then((res: { data: UsersStatsRes }) => {
        const {
          lessons_completed,
          reviews_completed,
          completed_kanji_levels,
          completed_vocab_levels,
          completed_grammar_levels
        } = res.data

        changeLessonsCompleted(lessons_completed)
        changeReviewsCompleted(reviews_completed)
        changeCompletedKanjiLevels(completed_kanji_levels)
        changeCompletedVocabLevels(completed_vocab_levels)
        changeCompletedGrammarLevels(completed_grammar_levels)
      })
  }, [])

  const { pathname } = useLocation()
  const className = `statistics-container ${pathname === HOME_PATH ? 'statistics-container-on-homepage' : (STATISTICS_PATH ? 'statistics-container-on-statistics-page' : '')}`

  return (
        <div className={className}>
            <ReviewsLessonsTracker lessonsCompleted={lessonsCompleted} reviewsCompleted={reviewsCompleted} />
            <JLPTContentCovered
              completedKanjiLevels={completedKanjiLevels}
              completedVocabLevels={completedVocabLevels}
              completedGrammarLevels={completedGrammarLevels}
            />
        </div>
  )
}
