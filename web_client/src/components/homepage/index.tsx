import { useEffect } from 'react'
import './index.scss'
import {
  useAppSelector,
  useAppDispatch
} from '../../app/hooks'
// import { getLevelInfo } from '../../app/userSlice'
// import { EachLessonsContent } from '../lessons/lesson/LessonsPlan'
import { SideInfo } from './SideInfo'
import { CardsSrsLevels } from './CardsSrsLevels'
import './LinkButton.scss'
import { updateSrsFlashcards } from 'src/app/srsFlashcardsSlice'
import axios from 'axios'
import { updateUserInfo } from 'src/app/userSlice'
import { HOME_PATH, REVIEWS_PATH, LESSONS_PATH } from 'src/paths'
import LessonImage from './LessonImage.png'
import ReviewImage from './ReviewImage.png'
import { LinkButton } from './LinkButton'
import { StatisticsSection } from '../Statistics'
import { keysToCamel } from 'src/components/shared/keysToCamel'

export const cantProgressNextLessonBecauseLevelTooLowMsg = 'It seems as though further lessons are currently unavailable. Doing reviews when they are available can help you gain exp and level up so you can progress to future levels!'
export const completedAllLessonsMsg = 'Thank you for going so far into the lessons! There are currently no more lessons for now but stay tuned, updates will definitely come! We really appreciate you!'

/**
 * The main page the user sees when logging into the site,
 * contains links to review lessons or learn new concepts
 */
export const Homepage = (): JSX.Element => {
  const { srsCardsToReview, allSrsCards } = useAppSelector(state => state.srsFlashcards)
  const dispatch = useAppDispatch()

  useEffect(() => {
    axios.get('users/homepage/')
      .then(res => {
        const {
          review_cards,
          username,
          email,
          experiencePoints,
          readMsgForCurrentLevel,
          profilePicture,
          dates_studied: datesStudied,
          date_joined: dateJoined,
          srs_limit: srsLimit
        } = res.data
        dispatch(updateUserInfo({
          username,
          email,
          experiencePoints,
          readMsgForCurrentLevel,
          profilePicture,
          datesStudied,
          dateJoined,
          srsLimit
        }))
        const reviewCards = review_cards.map((card: any) => keysToCamel(card))
        dispatch(updateSrsFlashcards({
          srsCardsToReview: reviewCards.filter(({ nextReviewDate }: any) => nextReviewDate != null && ((new Date(nextReviewDate)) <= new Date())),
          allSrsCards: reviewCards
        }))
      })
      .catch(err => {
        console.log(err)
      })
  }, [dispatch])

  return (
        <div aria-label='homepage container' className='homepage-container'>
            <div className='homepage-contents'>
                <div className='current-level-info-and-links-container'>
                    <div className='links-to-learning-container'>
                        <div className='links-to-learning-container-first-row'>
                            <LinkButton 
                                name='Reviews'
                                link={srsCardsToReview.length > 0 ? REVIEWS_PATH : HOME_PATH}
                                image={ReviewImage}
                                className='review-button'
                                numberToDisplay={srsCardsToReview.length}
                            />
                            <LinkButton 
                                name='Lessons'
                                link={LESSONS_PATH}
                                image={LessonImage}
                                className='lesson-button'
                            />
                        </div>
                    </div>

                    <CardsSrsLevels allSrsCards={allSrsCards} />
                    <StatisticsSection />
                </div>

                <SideInfo allSrsCards={allSrsCards} />
            </div>
        </div>
  )
}
