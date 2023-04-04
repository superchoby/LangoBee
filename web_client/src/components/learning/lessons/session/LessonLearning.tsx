import { useState, useEffect } from 'react'
import { LearningFlashcard } from '../../../../context/JapaneseDatabaseContext/SharedVariables'
import './LessonLearning.scss'
import { ForwardBackButton } from './ForwardBackButton'
import { JapaneseSubjectData } from '../SubjectTypes'
import Modal from 'react-modal'
import { MdOutlineArrowForward } from 'react-icons/md'
import axios from 'axios'
import { 
  SubjectsSubInfo,
  getPropsForSubjectsInfo,
  SubjectsInfoForComponents,
  defaultSubjectPresenterProps
} from '../../SubjectsSubInfo'
import { useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import { LESSONS_PATH } from 'src/paths'
import { BackButton } from 'src/components/shared/BackButton'

export interface LearningCardProp extends LearningFlashcard {
  pronunciationFileKey: string
}

interface LessonLearningProps {
  /**
     * Concepts to teach
     */
  // cards: LearningCardProp[]
  // /**
  //    * Brings the user to the quiz section
  //    */
  subjectsToTeach: JapaneseSubjectData[]
  startQuiz: () => void
  // conceptType: GENERAL_CONCEPT_TYPE
}

/**
 * Teaches the user the concept they are learning for the first time
 */
export const LessonLearning = ({
  subjectsToTeach: initialSubjectsToTeach,
  // cards,
  startQuiz,
  // conceptType
}: LessonLearningProps): JSX.Element => {
  const [currentSubjectIdx, changeCurrentSubjectIdx] = useState(0)
  const [subjectPresenterPropValues, changeSubjectPresenterPropValues] = useState<SubjectsInfoForComponents>(defaultSubjectPresenterProps)
  const [subjectsToTeach, changeSubjectsToTeach] = useState(initialSubjectsToTeach)
  const [readyToStartQuiz, changeReadyToStartQuiz] = useState(false)
  const [showStartQuizModal, changeShowStartQuizModal] = useState(false)
  const [confirmUserKnowsSubject, changeConfirmUserKnowsSubject] = useState(false)
  const [markingUserAsKnowingSubject, changeMarkingUserAsKnowingSubject] = useState(false)
  const [errorConfirmingUserKnowsSubject, changeErrorConfirmingUserKnowsSubject] = useState(false)
  const [contentToDisplay, setContentToDisplay] = useState('')
  const {
    subjectText,
    subjectMainDescription,
    subjectInfoToDisplay,
    subjectType,
    audioFile
  } = subjectPresenterPropValues
  // eventualy add feature so it plays right away
  // const [play] = useSound((audioFile != null && audioFile.length) > 0 ? `${AUDIO_FILE_BASE_URL}${audioFile}` : '.mp4')

  const navigate = useNavigate()

  const indexOfCurrentContentBeingViewed = subjectInfoToDisplay.findIndex(({header}) => header === contentToDisplay)

  useEffect(() => {
    const currentViewingLastSubject = currentSubjectIdx === subjectsToTeach.length - 1
    const currentlyViewingLastSection = indexOfCurrentContentBeingViewed === subjectInfoToDisplay.length - 1
    
    if (currentViewingLastSubject && currentlyViewingLastSection) {
      changeReadyToStartQuiz(true)
    }
  }, [
      currentSubjectIdx, 
      indexOfCurrentContentBeingViewed, 
      subjectInfoToDisplay.length, 
      subjectsToTeach.length
    ])

  useEffect(() => {
    if (currentSubjectIdx > subjectsToTeach.length - 1) {
      changeCurrentSubjectIdx(subjectsToTeach.length - 1)
    } else {
      changeSubjectPresenterPropValues(getPropsForSubjectsInfo(subjectsToTeach[currentSubjectIdx], false))
    }
  }, [currentSubjectIdx, subjectsToTeach])

  useEffect(() => {
    if (subjectInfoToDisplay.length > 0) {
      setContentToDisplay(subjectInfoToDisplay[0].header)
    }
  }, [subjectInfoToDisplay])

  // useEffect(() => {
  //   if (audioFile != null && audioFile.length > 0) {
  //     play()
  //   }
  // }, [audioFile, play])

  const markUserAsKnowingSubject = () => {
    changeMarkingUserAsKnowingSubject(true)
    axios.post('reviews/', { subjectId: subjectsToTeach[currentSubjectIdx].subjectId, userKnows: true })
    .then(() => {
      if (subjectsToTeach.length === 1) {
        navigate(LESSONS_PATH)
      }
      changeSubjectsToTeach(subjectsToTeach.filter(({subjectId}) => (
        subjectId !== subjectsToTeach[currentSubjectIdx].subjectId
      )))
      changeErrorConfirmingUserKnowsSubject(false)
      changeConfirmUserKnowsSubject(false)
      changeMarkingUserAsKnowingSubject(false)
    })
    .catch(() => {
      changeErrorConfirmingUserKnowsSubject(true)
      changeMarkingUserAsKnowingSubject(false)
    })
  }

  const handleGoingForwardOrBack = (goingForward: boolean) => {
    if (goingForward) {
      if (indexOfCurrentContentBeingViewed + 1 < subjectInfoToDisplay.length) {
        setContentToDisplay(subjectInfoToDisplay[indexOfCurrentContentBeingViewed + 1].header)
      } else if (currentSubjectIdx < subjectsToTeach.length - 1) {
        changeCurrentSubjectIdx(currentSubjectIdx + 1)
        setContentToDisplay(subjectInfoToDisplay[0].header)
      } else {
        changeShowStartQuizModal(true)
      }
    } else {
      if (indexOfCurrentContentBeingViewed - 1 >= 0) {
        setContentToDisplay(subjectInfoToDisplay[indexOfCurrentContentBeingViewed - 1].header)
      } else if (currentSubjectIdx - 1 >= 0) {
        changeCurrentSubjectIdx(currentSubjectIdx - 1)
      }
    }
  }

  const cardConceptLargeOrSmallFont = subjectText.length < 4 ? 'concept-being-taught-smaller-font' : 'concept-being-taught-larger-font'

  return (
        <div 
          className='learning-section-container' 
          onKeyDown={({ key }) => {
            if (key === 'ArrowLeft') {
              handleGoingForwardOrBack(false)
            } else if (key === 'ArrowRight') {
              handleGoingForwardOrBack(true)
            } else if (key === 'Enter' && showStartQuizModal) {
              startQuiz()
            }
          }}
          tabIndex={0}
          >    
          <div className='lessons-learning-back-button-container'>
            <BackButton />
          </div>
          
          {subjectPresenterPropValues.subjectText.length > 0 && (
            <div className='subject-presenter-wrapper'>
              <div aria-label='Concept Presenter' className='concept-presenter-container'>
                  <ForwardBackButton
                    onClick={() => handleGoingForwardOrBack(false)}
                    isForwardButton={false}
                    display={currentSubjectIdx > 0 || indexOfCurrentContentBeingViewed > 0}
                  />
                  <div className={`concept-and-explanation-container ${`concept-and-explanation-container-for-${subjectType}`}`}>
                    <h1 className={`concept-being-taught ${cardConceptLargeOrSmallFont}`}>{subjectText}</h1>
                    <span className='explanation-header'>{subjectMainDescription}</span>
                  </div>
                  <ForwardBackButton
                      onClick={() => { handleGoingForwardOrBack(true) }}
                      isForwardButton={true}
                      display={true}
                  />
              </div>
              <div className='lesson-learning-subject-type-indicator'>{subjectType}</div>
              <SubjectsSubInfo 
                contentToDisplay={contentToDisplay}
                setContentToDisplay={setContentToDisplay}
                subjectInfo={subjectInfoToDisplay} 
              />
            </div>            
          )}

        <div className='lesson-learning-button-options-container'>
            <button 
              className='already-know-subject-button'
              onClick={() => {changeConfirmUserKnowsSubject(true)}}
            >
              Already Know
            </button>

            <div className='lesson-progress-and-quiz-button'>
              <div className='lesson-learning-progress-tracker'>
                {Array(subjectsToTeach.length).fill(0).map((_, i) => {
                  let classNameForDot = ''
                  if (i === currentSubjectIdx) {
                    classNameForDot = 'currently-viewing'
                  }

                  return <div key={i} className={`lesson-learning-progress-tracker-dot ${classNameForDot}-lesson-learning-progress-tracker-dot`} />
                })}
              </div>
              <button 
                className={`start-quiz-button ${readyToStartQuiz ? 'start-quiz-button-active' : ''}`}
                onClick={() => { if(readyToStartQuiz) startQuiz() }}
              >
                Quiz <MdOutlineArrowForward />
              </button>
            </div>
        </div>

        <Modal
            ariaHideApp={false}
            overlayClassName='lessons-session-ready-to-start-quiz-modal-overlay'
            className='lessons-session-ready-to-start-quiz-modal'
            isOpen={confirmUserKnowsSubject}
            onRequestClose={(() => changeConfirmUserKnowsSubject(false))}
            preventScroll={true}
          > 
            <h3>Confirmation</h3>
            <p>This subject won't pop up in your reviews to study and you'll move onto the next subject</p>

            <div className='lessons-session-ready-to-start-quiz-modal-buttons-container'>
              <button 
                className='lessons-session-dont-start-quiz-button'
                onClick={() => changeConfirmUserKnowsSubject(false)}
              >
                Cancel
              </button>
              <button 
                className='lessons-session-start-quiz-button'
                onClick={markUserAsKnowingSubject}
              >
                {markingUserAsKnowingSubject ? <ClipLoader size={10} /> : (errorConfirmingUserKnowsSubject ? 'Error' : 'Confirm')}
              </button>
            </div>
          </Modal>
        

          <Modal
            ariaHideApp={false}
            overlayClassName='lessons-session-ready-to-start-quiz-modal-overlay'
            className='lessons-session-ready-to-start-quiz-modal'
            isOpen={showStartQuizModal}
            onRequestClose={(() => changeShowStartQuizModal(false))}
            preventScroll={true}
          > 
            <h3>Ready to test your knowledge?</h3>
            <p>Take the quiz if you feel ready!</p>
            <div className='lessons-session-ready-to-start-quiz-modal-buttons-container'>
              <button 
                className='lessons-session-dont-start-quiz-button'
                onClick={() => changeShowStartQuizModal(false)}
              >
                Not yet
              </button>
              <button 
                className='lessons-session-start-quiz-button'
                onClick={startQuiz}
              >
                Quiz me!
              </button>
            </div>
          </Modal>

        </div>
  )
}
