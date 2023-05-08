import { useState, useEffect, useMemo, useCallback } from 'react'
import shuffle from 'shuffle-array'
import { isAGrammarQuestion, type KanaVocabQuestionType } from 'src/context/JapaneseDatabaseContext/SharedVariables'
import { IoMdClose } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { type JapaneseSubjectData, VOCABULARY_TYPE, MULTIPLE_CHOICE_TYPE, GRAMMAR_TYPE } from '../../learning/lessons/SubjectTypes'
import { convertSubjectDataToQuestions, type QuizQuestion } from './ConvertSubjectDataToQuestions'
import { KanaVocabQuestion } from './KanaVocabQuestion'
import { SubjectsSubInfo, getPropsForSubjectsInfo } from '../../learning/SubjectsSubInfo'
import { QuizResultsPage } from './QuizResultsPage'
import { isKana } from 'wanakana'
import { HOME_PATH } from 'src/paths'
import Modal from 'react-modal'
import './index.scss'
import { GrammarQuestion } from './GrammarQuestion'

export const correctlyAnsweredType = 'correctly answered'
export const incorrectlyAnsweredType = 'incorrectly answered'
export const notYetAnsweredType = 'not yet answered'

const putTheVocabQuestionsAskingMeaningsFirst = (questions: QuizQuestion[]) => {
  const rearrangedQuestions = [...questions]
  const shuffledQuestions: Record<string, true> = {}
  for (let i = 0; i < rearrangedQuestions.length; ++i) {
    const { subjectData: { japaneseSubjectType, subjectId }, questionContents } = rearrangedQuestions[i]
    if (japaneseSubjectType === VOCABULARY_TYPE) {
      const { question, inputPlaceholder } = questionContents as KanaVocabQuestionType
      if (!Object.prototype.hasOwnProperty.call(shuffledQuestions, subjectId) && typeof (question) === 'string' && !isKana(question) && inputPlaceholder === 'Reading') {
        for (let j = i + 1; j < rearrangedQuestions.length; ++j) {
          if (rearrangedQuestions[j].subjectData.subjectId === subjectId && (rearrangedQuestions[j].questionContents as KanaVocabQuestionType).inputPlaceholder === 'Meaning') {
            const temp = rearrangedQuestions[i]
            rearrangedQuestions[i] = rearrangedQuestions[j]
            rearrangedQuestions[j] = temp
            shuffledQuestions[subjectId] = true
            break
          }
        }
      }
    }
  }

  return rearrangedQuestions
}

export type SubjectsAnsweredStatus = Record<string, {
  timesAnswered: number
  timesNeedsToBeAnsweredBeforeCompletion: number
  userGotCorrect: boolean
}>

export interface QuizGeneratorProps {
  content: JapaneseSubjectData[]
  errorMessage: string
  onCompletedAllSubjectsQuestions?: (subjectId: string, userGotCorrect: boolean) => void
  onFinishedSubjectsQuestionsComponent?: (userGotQuestionCorrect: boolean, subjectId: string, choiceSubmitted: boolean) => JSX.Element
  separateCorrectAndIncorrectSubjects: boolean
  onDoneWithQuiz?(correctSubjects: JapaneseSubjectData[], incorrectSubjects: JapaneseSubjectData[]): void
  // Typical Quiz, no retaking questions and score is tracked
  testMode: boolean
  resultsPageInfo: {
    hasIncorrectSection: boolean
    headerForCorrectSubjects?: string
    componentForEachSubject?: (subjectText: string, subjectId: string) => JSX.Element
    leaveButtonLink: string
    leaveButtonText: string
    messageOnTop: string
  }
  showLoadingResultsMessage: boolean
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
  testMode,
  onDoneWithQuiz,
  showLoadingResultsMessage
  // changeQuizIsDone
}: QuizGeneratorProps): JSX.Element => {
  const [timesSubjectAnsweredAndNeedsToBeAnswered, changeTimesSubjectAnsweredAndNeedsToBeAnswered] = useState<SubjectsAnsweredStatus>({})
  const [questionsOrder, changeQuestionsOrder] = useState<QuizQuestion[]>([])
  const [usersTotalPoints, changeUsersTotalPoints] = useState(0)
  const [choiceHasBeenSubmitted, changeChoiceHasBeenSubmitted] = useState(false)
  const [answerHasBeenEntered, changeAnswerHasBeenEntered] = useState(false)
  const [currentAnswerStatus, changeCurrentAnswerStatus] = useState<'correct' | 'incorrect' | 'acceptable but not correct'>('incorrect')
  const [isInvalidInput, changeIsInvalidInput] = useState(false)
  const [hasInvalidInputClass, changeHasInvalidInputClass] = useState(false)
  const [guessIsRightButWrongKana, changeGuessIsRightButWrongKana] = useState(false)
  const [typingInHiragana, changeTypingInHiragana] = useState(true)
  const [confirmIfUserWantsToStopTheQuiz, changeConfirmIfUserWantsToStopTheQuiz] = useState(false)
  const [quizIsDone, changeQuizIsDone] = useState(false)
  const [contentToDisplay, setContentToDisplay] = useState('')
  const [userHasPressedEnter, changeUserHasPressedEnter] = useState(false)
  const [correctSubjects, changeCorrectSubjects] = useState<JapaneseSubjectData[]>([])
  const [incorrectSubjects, changeIncorrectSubjects] = useState<JapaneseSubjectData[]>([])

  const navigate = useNavigate()

  const totalPointsNeeded = content.length
  const userHasntYetFinishedAllQuestions = usersTotalPoints < content.length

  const handleAnswerSubmit = useCallback((): void => {
    if (answerHasBeenEntered && !isInvalidInput && !guessIsRightButWrongKana && currentAnswerStatus !== 'acceptable but not correct') {
      if (choiceHasBeenSubmitted) {
        const questionsOrderCopy: QuizQuestion[] = [...questionsOrder]
        const currentQuestion = questionsOrderCopy.shift() as QuizQuestion
        // If on test mode, don't put wrong questions back
        if (currentAnswerStatus === 'correct' || testMode) {
          changeQuestionsOrder(questionsOrderCopy)
        } else {
          questionsOrderCopy.push(currentQuestion)
          changeQuestionsOrder(putTheVocabQuestionsAskingMeaningsFirst(questionsOrderCopy))
        }
        changeChoiceHasBeenSubmitted(false)
        changeCurrentAnswerStatus('incorrect')
      } else {
        changeChoiceHasBeenSubmitted(true)
        const currentQuestion = questionsOrder[0]
        const { subjectId } = currentQuestion.subjectData 
        if (currentAnswerStatus === 'correct') {
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
            if (onCompletedAllSubjectsQuestions != null) {
              onCompletedAllSubjectsQuestions(subjectId, userGotCorrect)
            }
            if (!correctSubjects.some(data => data.subjectId === subjectId)) {
              changeCorrectSubjects([...correctSubjects, currentQuestion.subjectData ])
            }
          }
        } else {
          if (!incorrectSubjects.some(data => data.subjectId === subjectId)) {
            changeIncorrectSubjects([...incorrectSubjects, currentQuestion.subjectData ])
          }
          changeTimesSubjectAnsweredAndNeedsToBeAnswered({
            ...timesSubjectAnsweredAndNeedsToBeAnswered,
            [subjectId]: {
              ...timesSubjectAnsweredAndNeedsToBeAnswered[subjectId],
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
  }, [
    answerHasBeenEntered,
    choiceHasBeenSubmitted,
    currentAnswerStatus,
    guessIsRightButWrongKana,
    isInvalidInput,
    onCompletedAllSubjectsQuestions,
    questionsOrder,
    timesSubjectAnsweredAndNeedsToBeAnswered,
    usersTotalPoints,
    testMode,
    correctSubjects,
    incorrectSubjects
  ])

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

    const shuffledQuestions = shuffle(newQuestionsOrder, { copy: true })
    changeTimesSubjectAnsweredAndNeedsToBeAnswered(timesSubjectAnsweredAndNeedsToBeAnswered)
    changeQuestionsOrder(putTheVocabQuestionsAskingMeaningsFirst(shuffledQuestions))
    changeUsersTotalPoints(0)
    changeChoiceHasBeenSubmitted(false)
  }, [content])

  const handleAnswerSubmitOrHandleFinishedQuiz = useCallback((): void => {
    if (userHasntYetFinishedAllQuestions) {
      handleAnswerSubmit()
    } else {
      changeQuizIsDone(true)
      if (onDoneWithQuiz != null) {
        onDoneWithQuiz(correctSubjects, incorrectSubjects)
      }
    }
  }, [
    handleAnswerSubmit, 
    userHasntYetFinishedAllQuestions, 
    onDoneWithQuiz,
    correctSubjects,
    incorrectSubjects
  ])

  const handleKeyDown = ({ key }: { key: string }): void => {
    if (key === 'Enter') {
      changeUserHasPressedEnter(true)
      handleAnswerSubmitOrHandleFinishedQuiz()
    } else if (key === 'Shift') {
      changeTypingInHiragana(!typingInHiragana)
    }
  }

  const questionComponent = useMemo(() => {
    // hanlde other q types
    if (questionsOrder.length > 0) {
      if (questionsOrder[0].subjectData.subjectType === GRAMMAR_TYPE) {
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
              handleAnswerSubmitOrHandleFinishedQuiz={handleAnswerSubmitOrHandleFinishedQuiz}
              currentAnswerStatus={currentAnswerStatus}
              changeAnswerHasBeenEntered={changeAnswerHasBeenEntered}
              hasInvalidInputClass={hasInvalidInputClass}
              changeHasInvalidInputClass={changeHasInvalidInputClass}
              isInvalidInput={isInvalidInput}
              changeIsInvalidInput={changeIsInvalidInput}
              changeGuessIsRightButWrongKana={changeGuessIsRightButWrongKana}
              typingInHiragana={typingInHiragana}
              isMultipleChoice={questionsOrder[0].subjectData.subjectType === MULTIPLE_CHOICE_TYPE}
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
    typingInHiragana,
    handleAnswerSubmitOrHandleFinishedQuiz
  ])

  const thisSubjectsInfo = useMemo(() => {
    return questionsOrder.length > 0 ? getPropsForSubjectsInfo(questionsOrder[0].subjectData, true).subjectInfoToDisplay : []
  }, [questionsOrder])

  return (
    <div data-testid='quiz-generator-container' className='quiz-generator-container' onKeyDown={handleKeyDown} tabIndex={0}>
      {quizIsDone
        ? (
            (() => {
              const {
                hasIncorrectSection,
                headerForCorrectSubjects,
                componentForEachSubject,
                leaveButtonLink,
                leaveButtonText,
                messageOnTop
              } = resultsPageInfo
              return (
                <QuizResultsPage
                  correctSubjects={correctSubjects}
                  incorrectSubjects={incorrectSubjects}
                  hasIncorrectSection={hasIncorrectSection}
                  correctSectionHeader={headerForCorrectSubjects}
                  componentForEachSubject={componentForEachSubject}
                  leaveButtonLink={leaveButtonLink}
                  leaveButtonText={leaveButtonText}
                  messageOnTop={messageOnTop}
                  showLoadingResultsMessage={showLoadingResultsMessage}
                />
              )
            })()
          )
        : (
        <>
          <Modal
            ariaHideApp={false}
            className='quiz-generator-confirm-quit-modal'
            isOpen={confirmIfUserWantsToStopTheQuiz}
            onRequestClose={(() => { changeConfirmIfUserWantsToStopTheQuiz(false) })}
            preventScroll={true}
          >
            <h2 className='lesson-preview-header'>Pause the Quiz?</h2>
            <p>Your progress has all been saved so no worries about that.</p>
            <div className='quiz-generator-confirm-quit-modal-buttons-container'>
              <button
                className='quiz-generator-cancel-done-button'
                onClick={() => { changeConfirmIfUserWantsToStopTheQuiz(false) }}
              >
                Cancel
              </button>
              <button
                className='quiz-generator-confirm-done-button'
                onClick={() => { changeQuizIsDone(true) }}
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
              <div className='quiz-generator-current-progress' style={{ width: `${((content.length - questionsOrder.length) / totalPointsNeeded) * 100}%` }} />
            </div>
            <div className='quiz-generator-users-progress-fraction'>{usersTotalPoints} / {totalPointsNeeded}</div>
          </div>
            {
                questionsOrder.length > 0 && (
                    <div className='question-container'>
                        <div className='question-prompt'>Please enter {questionsOrder[0].questionContents.questionPrompt}</div>
                        <div className='questions-component-container'>
                          <div className='on-finished-subjects-questions-component-container'>
                            {onFinishedSubjectsQuestionsComponent?.(
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
            {choiceHasBeenSubmitted && thisSubjectsInfo.length > 0 && (
              <SubjectsSubInfo
                contentToDisplay={contentToDisplay}
                setContentToDisplay={setContentToDisplay}
                subjectInfo={thisSubjectsInfo}
              />
            )}
        </div>
          <div className='quiz-generator-button-container'>
            {!userHasPressedEnter && <p className='enter-tip'>Tip: You can press "enter" to check your answer and continue</p>}
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
