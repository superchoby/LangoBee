import { useState, useEffect, useMemo } from 'react'
import shuffle from 'shuffle-array'
import { isAGrammarQuestion } from 'src/context/JapaneseDatabaseContext/SharedVariables'
import { IoMdClose } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { JapaneseSubjectData } from '../../learning/lessons/SubjectTypes'
import { convertSubjectDataToQuestions, QuizQuestion } from './ConvertSubjectDataToQuestions'
import { KanaVocabQuestion } from './KanaVocabQuestion'
import { SubjectsSubInfo, getPropsForSubjectsInfo } from '../../learning/SubjectsSubInfo'
import { QuizResultsPage } from './QuizResultsPage'

import { HOME_PATH } from 'src/paths'
import Modal from 'react-modal'
import './index.scss'
import { GrammarQuestion } from './GrammarQuestion'

export const correctlyAnsweredType = 'correctly answered'
export const incorrectlyAnsweredType = 'incorrectly answered'
export const notYetAnsweredType = 'not yet answered'

export interface SubjectsAnsweredStatus {
  [subjectId: number]: {
    timesAnswered: number
    timesNeedsToBeAnsweredBeforeCompletion: number
    userGotCorrect: boolean
  }
}

export interface QuizGeneratorProps {
  content: JapaneseSubjectData[]
  errorMessage: string
  onCompletedAllSubjectsQuestions(subjectId: number, userGotCorrect: boolean): void
  onFinishedSubjectsQuestionsComponent?(userGotQuestionCorrect: boolean, subjectId: number, choiceSubmitted: boolean): JSX.Element
  separateCorrectAndIncorrectSubjects: boolean
  resultsPageInfo: {
    hasIncorrectSection: boolean
    headerForCorrectSubjects?: string
    componentForEachSubject?: (subjectText: string, subjectId: number) => JSX.Element
    leaveButtonLink: string
    leaveButtonText: string
    messageOnTop: string
  }
}

/**
 * Container for kana, vocab, and grammar questions
 * Eventually want to merge with srs flashcards component
 */
export const QuizGenerator = ({
  content,
  onCompletedAllSubjectsQuestions,
  onFinishedSubjectsQuestionsComponent,
  resultsPageInfo,
  separateCorrectAndIncorrectSubjects,
  // changeQuizIsDone
}: QuizGeneratorProps): JSX.Element => {
  const [timesSubjectAnsweredAndNeedsToBeAnswered, changeTimesSubjectAnsweredAndNeedsToBeAnswered] = useState<SubjectsAnsweredStatus>({})
  const [questionsOrder, changeQuestionsOrder] = useState<QuizQuestion[]>([])
  const [usersTotalPoints, changeUsersTotalPoints] = useState(0)
  const [choiceHasBeenSubmitted, changeChoiceHasBeenSubmitted] = useState(false)
  const [answerHasBeenEntered, changeAnswerHasBeenEntered] = useState(false)
  const [currentAnswerStatus, changeCurrentAnswerStatus] = useState<'correct' | 'incorrect' | 'acceptable but not correct'>('incorrect')
  const [hideFinishButton, changeHideFinishButton] = useState(false)
  const [showFinishedMsg, changeShowFinishedMsg] = useState(false)
  const [isInvalidInput, changeIsInvalidInput] = useState(false)
  const [hasInvalidInputClass, changeHasInvalidInputClass] = useState(false)
  const [guessIsRightButWrongKana, changeGuessIsRightButWrongKana] = useState(false)
  const [typingInHiragana, changeTypingInHiragana] = useState(true)
  const [errorUpdatingStatusOfSubject, changeErrorUpdatingStatusOfSubject] = useState(false)
  const [currentlyProcessingOnQuizFinishRequest, changeCurrentlyProcessingOnQuizFinishRequest] = useState(false)
  const [confirmIfUserWantsToStopTheQuiz, changeConfirmIfUserWantsToStopTheQuiz] = useState(false)
  const [showSubjectsNewReviewLevel, changeShowSubjectsNewReviewLevel] = useState(false)
  const [quizIsDone, changeQuizIsDone] = useState(false)
  const [contentToDisplay, setContentToDisplay] = useState('')

  const navigate = useNavigate()
  
  const totalPointsNeeded = content.length
  const userHasntYetFinishedAllQuestions = usersTotalPoints < content.length

  const handleAnswerSubmit = (): void => {
    if (answerHasBeenEntered && !isInvalidInput && !guessIsRightButWrongKana && currentAnswerStatus !== 'acceptable but not correct') {
      if (choiceHasBeenSubmitted) {
        const questionsOrderCopy: QuizQuestion[] = [...questionsOrder]
        const currentQuestion = questionsOrderCopy.shift() as QuizQuestion
        if (currentAnswerStatus === 'correct') {
          changeQuestionsOrder(questionsOrderCopy)
        } else {
          questionsOrderCopy.push(currentQuestion)
          changeQuestionsOrder(questionsOrderCopy)
        }
        changeChoiceHasBeenSubmitted(false)
        changeCurrentAnswerStatus('incorrect')
        changeShowSubjectsNewReviewLevel(false)
      } else {
        changeChoiceHasBeenSubmitted(true)
        const currentQuestion = questionsOrder[0]
        if (currentAnswerStatus === 'correct') {
          const { subjectId } = currentQuestion.subjectData
          const {
            timesAnswered,
            timesNeedsToBeAnsweredBeforeCompletion,
            userGotCorrect
          } = timesSubjectAnsweredAndNeedsToBeAnswered[subjectId]
          const totalTimesAnswered = timesAnswered + 1
          changeTimesSubjectAnsweredAndNeedsToBeAnswered({
            ...timesSubjectAnsweredAndNeedsToBeAnswered,
            [subjectId]: {
              ...timesSubjectAnsweredAndNeedsToBeAnswered[subjectId],
              timesAnswered: totalTimesAnswered
            }
          })
          if (totalTimesAnswered === timesNeedsToBeAnsweredBeforeCompletion) {
            changeUsersTotalPoints(usersTotalPoints + 1)
            onCompletedAllSubjectsQuestions(subjectId, userGotCorrect)
          }
        } else {
          changeTimesSubjectAnsweredAndNeedsToBeAnswered({
            ...timesSubjectAnsweredAndNeedsToBeAnswered,
            [currentQuestion.subjectData.subjectId]: {
              ...timesSubjectAnsweredAndNeedsToBeAnswered[currentQuestion.subjectData.subjectId],
              userGotCorrect: false
            }
          })
        }
      }
    } else if (isInvalidInput || guessIsRightButWrongKana) {
      changeHasInvalidInputClass(true)
      setTimeout(() => {
        changeHasInvalidInputClass(false)
      }, 700)
    }
  }

  useEffect(() => {
    changeAnswerHasBeenEntered(questionsOrder.length > 0 ? (!!isAGrammarQuestion(questionsOrder[0].questionContents)) : false)
    changeIsInvalidInput(false)
    changeGuessIsRightButWrongKana(false)
    changeTypingInHiragana(true)
    changeQuizIsDone(false)
  }, [questionsOrder])

  useEffect(() => {
    const {
      timesSubjectAnsweredAndNeedsToBeAnswered,
      newQuestionsOrder
    } = convertSubjectDataToQuestions(content)

    changeTimesSubjectAnsweredAndNeedsToBeAnswered(timesSubjectAnsweredAndNeedsToBeAnswered)
    changeQuestionsOrder(shuffle(newQuestionsOrder, { copy: true }))
    changeUsersTotalPoints(0)
    changeChoiceHasBeenSubmitted(false)
    changeHideFinishButton(false)
    changeShowFinishedMsg(false)
  }, [content])

  const handleAnswerSubmitOrHandleFinishedQuiz = (): void => {
    if (userHasntYetFinishedAllQuestions) {
      handleAnswerSubmit()
    } else {
      changeQuizIsDone(true)
    }
  }

  const handleKeyDown = ({ key }: { key: string }): void => {
    if (key === 'Enter') {
      handleAnswerSubmitOrHandleFinishedQuiz()
    } else if (key === 'Shift') {
      changeTypingInHiragana(!typingInHiragana)
    }
  }

  const questionComponent = useMemo(() => {
    // hanlde other q types
    if (questionsOrder.length > 0) {
        if (questionsOrder[0].subjectData.subjectType === 'grammar') {
          return (
            <GrammarQuestion 
              choiceSubmitted={choiceHasBeenSubmitted}
              question={questionsOrder[0]}
              currentAnswerStatus={currentAnswerStatus}
              changeCurrentAnswerStatus={changeCurrentAnswerStatus}
              changeIsInvalidInput={changeIsInvalidInput}
              hasInvalidInputClass={hasInvalidInputClass}
            />
          )
        } else {
          return (
            <KanaVocabQuestion
              question={questionsOrder[0]}
              changeCurrentAnswerStatus={changeCurrentAnswerStatus}
              choiceSubmitted={choiceHasBeenSubmitted}
              currentAnswerStatus={currentAnswerStatus}
              changeAnswerHasBeenEntered={changeAnswerHasBeenEntered}
              hasInvalidInputClass={hasInvalidInputClass}
              changeHasInvalidInputClass={changeHasInvalidInputClass}
              isInvalidInput={isInvalidInput}
              changeIsInvalidInput={changeIsInvalidInput}
              changeGuessIsRightButWrongKana={changeGuessIsRightButWrongKana}
              typingInHiragana={typingInHiragana}
            />
          )
        }
    } else {
      return <></>
    }
  }, [
    choiceHasBeenSubmitted,
    currentAnswerStatus,
    hasInvalidInputClass,
    isInvalidInput,
    questionsOrder,
    typingInHiragana
  ])

  const thisSubjectsInfo = useMemo(() => {
    return questionsOrder.length > 0 ? getPropsForSubjectsInfo(questionsOrder[0].subjectData, true).subjectInfoToDisplay : []
  }, [questionsOrder])

  return (
        <div data-testid='quiz-generator-container' className='quiz-generator-container' onKeyDown={handleKeyDown} tabIndex={0}>
          {quizIsDone ? (
            (() => {
              type CorrectAndIncorrectSubjects = { correctSubjects: JapaneseSubjectData[], incorrectSubjects: JapaneseSubjectData[] }
              const {
                correctSubjects,
                incorrectSubjects
              } = (() => {
                if (separateCorrectAndIncorrectSubjects) {
                  return Object.entries(timesSubjectAnsweredAndNeedsToBeAnswered).reduce((accumulator, 
                    [
                      subjectId,
                      {
                        timesAnswered,
                        timesNeedsToBeAnsweredBeforeCompletion,
                        userGotCorrect,
                      }
                    ]) => {
                      if (timesAnswered === timesNeedsToBeAnsweredBeforeCompletion) {
                        const subjectIdInt = parseInt(subjectId)
                        if (userGotCorrect) {
                          return {
                            ...accumulator,
                            correctSubjects: [
                              ...accumulator.correctSubjects,
                              {
                                ...content.find((subject) => subject.subjectId === subjectIdInt)!,
                              }
                            ]
                          }
                        } else {
                          return {
                            ...accumulator,
                            incorrectSubjects: [
                              ...accumulator.incorrectSubjects,
                              {
                                ...content.find((subject) => subject.subjectId === subjectIdInt)!,
                              }
                            ]
                          }
                        }
                      }
                      return accumulator
                  }, {
                    correctSubjects: [],
                    incorrectSubjects: []
                  } as CorrectAndIncorrectSubjects)
                } else {
                  return {
                    correctSubjects: content.filter(subject => {
                      const {
                        timesAnswered,
                        timesNeedsToBeAnsweredBeforeCompletion,
                      } = timesSubjectAnsweredAndNeedsToBeAnswered[subject.subjectId]

                      return timesAnswered === timesNeedsToBeAnsweredBeforeCompletion
                    }),
                    incorrectSubjects: []
                  }
                }
                
            })()

            const {
              hasIncorrectSection,
              headerForCorrectSubjects,
              componentForEachSubject,
              leaveButtonLink,
              leaveButtonText,
              messageOnTop,
            } = resultsPageInfo
              return (
                <QuizResultsPage 
                  // isShowingResultsForLesson={isCurrentlyDoingLesson}
                  correctSubjects={correctSubjects}
                  incorrectSubjects={incorrectSubjects}
                  hasIncorrectSection={hasIncorrectSection}
                  correctSectionHeader={headerForCorrectSubjects}
                  componentForEachSubject={componentForEachSubject}
                  leaveButtonLink={leaveButtonLink}
                  leaveButtonText={leaveButtonText}
                  messageOnTop={messageOnTop}
                />
              )
            })()
          ) : (
            <>
              <Modal
                ariaHideApp={false}
                className='quiz-generator-confirm-quit-modal'
                isOpen={confirmIfUserWantsToStopTheQuiz}
                onRequestClose={(() => changeConfirmIfUserWantsToStopTheQuiz(false))}
                preventScroll={true}
              > 
                <h2 className='lesson-preview-header'>Pause the Quiz?</h2>
                <p>Your progress has all been saved so no worries about that.</p>
                <div className='quiz-generator-confirm-quit-modal-buttons-container'>
                  <button 
                    className='quiz-generator-cancel-done-button'
                    onClick={() => changeConfirmIfUserWantsToStopTheQuiz(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className='quiz-generator-confirm-done-button'
                    onClick={() => changeQuizIsDone(true)}
                  >
                    Finish
                  </button>
                </div>
              </Modal>
              <div className='quiz-generator-container-without-button'>
              <div className='quiz-generator-progress-bar-container'>
                <IoMdClose 
                  className='quiz-generator-close-icon' 
                  onClick={() => { 
                    if (usersTotalPoints === 0) {
                      navigate(HOME_PATH)
                    } else {
                      changeConfirmIfUserWantsToStopTheQuiz(true) 
                    }
                  }} 
                />
                <div className='quiz-generator-total-progress'>
                  <div className='quiz-generator-current-progress' style={{width: `${(usersTotalPoints / totalPointsNeeded) * 100}%`}} />
                  
                </div>
                <div className='quiz-generator-users-progress-fraction'>{usersTotalPoints} / {totalPointsNeeded}</div>
              </div>
                {
                    questionsOrder.length > 0 && (
                        <div className='question-container'>
                            <div className='question-prompt'>Please enter {questionsOrder[0].questionContents.questionPrompt}</div>
                            <div className='questions-component-container'>
                              <div className='on-finished-subjects-questions-component-container'>
                                {onFinishedSubjectsQuestionsComponent != null && onFinishedSubjectsQuestionsComponent(
                                  timesSubjectAnsweredAndNeedsToBeAnswered[questionsOrder[0].subjectData.subjectId].userGotCorrect,
                                  questionsOrder[0].subjectData.subjectId,
                                  choiceHasBeenSubmitted
                                )}
                              </div>
                              {questionComponent}
                            </div>
                        </div>
                    )
                }
                {choiceHasBeenSubmitted && (
                  <SubjectsSubInfo 
                    contentToDisplay={contentToDisplay}
                    setContentToDisplay={setContentToDisplay}
                    subjectInfo={thisSubjectsInfo}
                  />
                )}
            </div>
                <div className='quiz-generator-button-container'>
                  {/* <button className='done-for-now-button'>
                    Done
                  </button> */}
                  <button
                    className='check-button'
                    onClick={handleAnswerSubmitOrHandleFinishedQuiz}
                  >
                      {userHasntYetFinishedAllQuestions ? (choiceHasBeenSubmitted ? 'Continue' : 'Check') : 'Finish'}
                  </button>
                </div>
            </>
          )}
        </div>
  )
}
