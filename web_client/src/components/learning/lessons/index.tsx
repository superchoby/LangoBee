import { useState, useEffect } from 'react'
import './index.scss'
import {
  LessonButton,
  LEVEL_BUTTON_TYPE,
  ARTICLE_BUTTON_TYPE
} from './LessonButton'
import { LessonsDivider } from './LessonsDivider'
import Modal from 'react-modal'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { LESSONS_SESSION_PATH, ARTICLE_PATH, REVIEWS_INFO_PATH } from 'src/paths'
import ClipLoader from 'react-spinners/ClipLoader'
import { keysToCamel } from 'src/components/shared/keysToCamel'
import { TestToSkipLevelsButton } from './TestToSkipLevelsButton'

const SubjectsForLevelLi = ({
  subjectType,
  count
}: { subjectType: string, count: number }) => {
  return (
    <li className={`content-in-level-li ${subjectType}-content-in-level-li`} key={subjectType}>
      <span>{subjectType}</span>:<span>{count}</span>
    </li>
  )
}

interface SubjectsRemaining {
  hiragana?: number
  katakana?: number
  kanji?: number
  grammar?: number
  vocabulary?: number
  radical?: number
}

interface CourseLevel {
  number: number
  article: {
    slug: string
  } | null
  standardsLevel: {
    description: string
    name: string
  } | null
  testThatEndsHere: {
    textToEncourageUserToTake: string
    slug: string
  } | null
}

const getNewPosition = (position: number, positionIncreasing: boolean) => {
  let newPosition = position
  let newPositionIncreasing = positionIncreasing

  if (positionIncreasing) {
    if (position === 5) {
      newPosition -= 1
      newPositionIncreasing = false
    } else {
      newPosition += 1
    }
  } else {
    if (position === 1) {
      newPosition += 1
      newPositionIncreasing = true
    } else {
      newPosition -= 1
    }
  }

  return {
    newPosition,
    newPositionIncreasing
  }
}

export const Lessons = (): JSX.Element => {
  const [subjectsRemainingAtCurrentLevel, changeSubjectsRemainingAtCurrentLevel] = useState<SubjectsRemaining>({})
  const [showThisLevelsContents, changeShowThisLevelsContents] = useState<boolean>(false)
  const [previewThisLevelsArticle, changePreviewThisLevelsArticle] = useState(false)
  const [levelsList, changeLevelsList] = useState<CourseLevel[]>([])
  const [subjectsCompletedForCurrentLevel, changeSubjectsCompletedForCurrentLevel] = useState(0)
  const [currentLevelOnCourse, changeCurrentLevelOnCourse] = useState(1)
  const [userReadCurrentLevelsArticle, changeUserReadCurrentLevelsArticle] = useState(false)
  const [currentlyFetchingLevels, changeCurrentlyFetchingLevels] = useState(true)
  const [currentlyFetchingRemainingSubjectsForLevel, changeCurrentlyFetchingRemainingSubjectsForLevel] = useState(true)
  const [thisLevelsArticle, changeThisLevelsArticle] = useState<{ title: string, slug: string } | null>(null)
  const [usersSrsCountAndLimit, changeUsersSrsCountAndLimit] = useState({
    srsLimit: 0,
    srsSubjectsAddedToday: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    changeCurrentlyFetchingLevels(true)
    axios.get('/languages/levels_for_course/Japanese/main')
      .then(res => {
        const {
        // subjects_remaining_in_this_level,
          users_current_level,
          all_levels,
          user_read_current_levels_article,
          this_levels_article
        } = res.data

        changeUserReadCurrentLevelsArticle(user_read_current_levels_article)
        changeCurrentLevelOnCourse(users_current_level)
        changeLevelsList(all_levels.map((level: any) => keysToCamel(level)))
        changeCurrentlyFetchingLevels(false)
        changeThisLevelsArticle(this_levels_article)
      })
      .catch(err => {
        console.error(err)
        changeCurrentlyFetchingLevels(false)
      })

    axios.get('/languages/levels_for_course/current_remaining_subjects_for_level/Japanese/main')
      .then(res => {
        const {
          subjects_remaining_in_this_level,
          subjects_already_done_this_level
        } = res.data

        changeSubjectsCompletedForCurrentLevel(subjects_already_done_this_level)
        changeSubjectsRemainingAtCurrentLevel(subjects_remaining_in_this_level)
        changeCurrentlyFetchingRemainingSubjectsForLevel(false)
      })
      .catch(err => {
        console.error(err)
        changeCurrentlyFetchingRemainingSubjectsForLevel(false)
      })

    axios.get('/users/srs-info/')
      .then(res => {
        const {
          srs_limit,
          srs_subjects_added_today
        } = res.data
        changeUsersSrsCountAndLimit({
          srsLimit: srs_limit,
          srsSubjectsAddedToday: srs_subjects_added_today
        })
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const levels = []
  let levelsForCurrentStandard: JSX.Element[] = []
  let positionIncreasing = true
  let position = 3
  let currentStandardsLevelName = ''

  for (let i = 0; i < levelsList.length; ++i) {
    const { standardsLevel } = levelsList[i]
    if (standardsLevel != null && standardsLevel.name !== currentStandardsLevelName) {
      levelsForCurrentStandard = []
      let j = i

      while (j < levelsList.length && (levelsList[j].standardsLevel === null || j === i)) {
        const { number, article, testThatEndsHere } = levelsList[j]
        const thisButtonIsForTheCurrentLevel = number === currentLevelOnCourse
        const articleExistsForCurrentLevel = article != null
        if (articleExistsForCurrentLevel) {
          levelsForCurrentStandard.push(
            <LessonButton
              key={article.slug}
              isPastThisButtonsContents={number < currentLevelOnCourse || (number === currentLevelOnCourse && userReadCurrentLevelsArticle)}
              hasCompletedThisButton={number < currentLevelOnCourse || (number === currentLevelOnCourse && userReadCurrentLevelsArticle)}
              position={position as 1 | 2 | 3 | 4 | 5}
              currentButton={thisButtonIsForTheCurrentLevel && !userReadCurrentLevelsArticle}
              // onClick={() => navigate(ARTICLE_PATH(true, 'Japanese', article.slug))}
              onClick={() => { changePreviewThisLevelsArticle(true) }}
              hideHereIndicator={showThisLevelsContents}
              percentOfContentsComplete={userReadCurrentLevelsArticle ? 100 : 0}
              buttonType={ARTICLE_BUTTON_TYPE}
              color={(levels.length % 6) + 1}
            />
          )

          const {
            newPosition,
            newPositionIncreasing
          } = getNewPosition(position, positionIncreasing)
          position = newPosition
          positionIncreasing = newPositionIncreasing
        }

        levelsForCurrentStandard.push(
          <LessonButton
            key={number}
            level={number}
            isPastThisButtonsContents={number < currentLevelOnCourse}
            hasCompletedThisButton={number < currentLevelOnCourse}
            position={position as 1 | 2 | 3 | 4 | 5}
            currentButton={thisButtonIsForTheCurrentLevel && (articleExistsForCurrentLevel ? userReadCurrentLevelsArticle : true)}
            onClick={() => { if (thisButtonIsForTheCurrentLevel) changeShowThisLevelsContents(true) }}
            hideHereIndicator={showThisLevelsContents}
            percentOfContentsComplete={number === currentLevelOnCourse
              ? (
                  (subjectsCompletedForCurrentLevel / (Object.values(subjectsRemainingAtCurrentLevel).reduce((sum, val) => sum + val, 0) + subjectsCompletedForCurrentLevel)) * 100
                )
              : 1}
            buttonType={LEVEL_BUTTON_TYPE}
            color={(levels.length % 6) + 1}
          />
        )

        if (testThatEndsHere != null) {
          const {
            slug,
            textToEncourageUserToTake
          } = testThatEndsHere
          levelsForCurrentStandard.push(
            <TestToSkipLevelsButton
              message={textToEncourageUserToTake}
              testLink={slug}
            />
          )
        }

        const {
          newPosition,
          newPositionIncreasing
        } = getNewPosition(position, positionIncreasing)
        position = newPosition
        positionIncreasing = newPositionIncreasing
        j += 1
      }
      levels.push((
        <div key={standardsLevel.name}>
          <LessonsDivider header={standardsLevel.name} subheader={standardsLevel.description} color={(levels.length % 6) + 1} />
          <div className='levels-container'>
            {levelsForCurrentStandard}
          </div>
        </div>
      ))
      levelsForCurrentStandard = []
      currentStandardsLevelName = standardsLevel.name
      positionIncreasing = true
      position = 3
      // this is j - 1 because the for loop adds +1 to i
      i = j - 1
    }
  }

  const {
    srsLimit,
    srsSubjectsAddedToday
  } = usersSrsCountAndLimit

  return (
    <div className='lessons-level-select-container'>
      {currentlyFetchingLevels
        ? (
          <div className='lessons-learning-loading-msg'>
            <ClipLoader />
            Loading the lessons
          </div>
          )
        : (
        <>
          {levels}
          {/* <div className='more-lessons-to-come-msg'>More Lessons to come soon ! ✍️ </div> */}
        </>
          )}

      <Modal
        ariaHideApp={false}
        className='lessons-content-preview'
        isOpen={previewThisLevelsArticle || showThisLevelsContents}
        onRequestClose={(() => { changeShowThisLevelsContents(false) })}
        preventScroll={true}
      >
        {previewThisLevelsArticle
          ? (
          <>
            <h2 className='lesson-preview-header'>Article</h2>
            <div className='article-preview-description'>
              You will be reading about: <span className='bold-span'>{thisLevelsArticle?.title}</span>
            </div>
            <div className='lesson-levels-button-container'>
              <button className='cancel-lesson-button' onClick={() => { changePreviewThisLevelsArticle(false) }}>Cancel</button>
              <button className='start-lesson-button' onClick={() => { navigate(ARTICLE_PATH(true, 'Japanese', thisLevelsArticle?.slug)) }}>Start</button>
            </div>
          </>
            )
          : (srsLimit - srsSubjectsAddedToday > 0
              ? (
          <>
            <h2 className='lesson-preview-header'>Lesson Preview</h2>
            {
              currentlyFetchingRemainingSubjectsForLevel
                ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ClipLoader />
                  Fetching the Content
                </div>
                  )
                : (
                <>
                  {showThisLevelsContents && (
                    <ul className='subjects-for-this-level-ul'>
                      {['hiragana', 'katakana', 'radical', 'kanji', 'vocabulary', 'grammar'].reduce<JSX.Element[]>((accumulator: JSX.Element[], subjectType) => {
                        // @ts-expect-error
                        if (Object.prototype.hasOwnProperty.call(subjectsRemainingAtCurrentLevel, subjectType) && subjectsRemainingAtCurrentLevel[subjectType] > 0) {
                          // @ts-expect-error
                          return [...accumulator, <SubjectsForLevelLi subjectType={subjectType} count={subjectsRemainingAtCurrentLevel[subjectType]!} key={subjectType} />]
                        }

                        return [...accumulator]
                      }, [])}
                    </ul>
                  )}
                </>
                  )
            }

            <div className='remaining-subjects-that-can-be-studied-today'>
              <div>
                {srsLimit - srsSubjectsAddedToday} more subjects you can study today.
                <Link to={REVIEWS_INFO_PATH + '/#reason-limit-is-set'}>&nbsp;Details</Link>
              </div>
            </div>

            <div className='lesson-levels-button-container'>
              <button className='cancel-lesson-button' onClick={() => { changeShowThisLevelsContents(false) }}>Cancel</button>
              <button className='start-lesson-button' onClick={() => { navigate(LESSONS_SESSION_PATH) }}>Start</button>
            </div>
          </>
                )
              : (
          <>
            <h2 className='lesson-preview-header'>Lessons Limit</h2>
            <p>
              You currently hit your lessons limit for today.
              This is set so that your reviews don't pile up to
              unmanageable loads. Read more about it
              <Link to={REVIEWS_INFO_PATH + '/#reason-limit-is-set'}>&nbsp;here</Link>.
              This limit change be changed in the settings however we recommend that it
              isn't set too high as in just a few days the reviews can pile up really high.
              </p>
          </>
                ))}
        {}

      </Modal>
    </div>
  )
}
