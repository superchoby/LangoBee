import './index.scss'
import { useAppSelector } from '../../app/hooks'
import { SideInfo } from './SideInfo'
import { CardsSrsLevels } from './CardsSrsLevels'
import './LinkButton.scss'
import { HOME_PATH, REVIEWS_PATH, LESSONS_PATH } from 'src/paths'
import LessonImage from './LessonImage.png'
import ReviewImage from './ReviewImage.png'
import { LinkButton } from './LinkButton'
import { StatisticsSection } from '../Statistics'
import { FaDiscord } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export const cantProgressNextLessonBecauseLevelTooLowMsg = 'It seems as though further lessons are currently unavailable. Doing reviews when they are available can help you gain exp and level up so you can progress to future levels!'
export const completedAllLessonsMsg = 'Thank you for going so far into the lessons! There are currently no more lessons for now but stay tuned, updates will definitely come! We really appreciate you!'

/**
 * The main page the user sees when logging into the site,
 * contains links to review lessons or learn new concepts
 */
export const Homepage = (): JSX.Element => {
  const { srsCardsToReview, allSrsCards } = useAppSelector(state => state.srsFlashcards)

  return (
    <div style={{marginBottom: '30px', position: 'relative'}}>
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
      {/* <div className='join-discord-msg'>
        <span>Come have fun with us on &nbsp;</span> 
        <a href='https://discord.gg/5MKkcCHa6f' target="_blank" rel="noopener noreferrer">
          Discord &nbsp;<FaDiscord />
        </a>
      </div> */}
    </div>
  )
}
