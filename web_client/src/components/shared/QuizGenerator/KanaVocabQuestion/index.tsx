import { useState, useEffect } from 'react'
import './KanaVocabQuestion.scss'
import 'react-dropdown/style.css'
import { type QuizQuestion } from '../ConvertSubjectDataToQuestions'
import { KanaVocabInputQuestion } from './InputQuestion'
import { KanaVocabQuestionMultipleChoice } from './MultipleChoice'

interface KanaVocabQuestionProps {
  question: QuizQuestion
  /**
     * Whether or not the user has submitted an answer
     */
  choiceSubmitted: boolean
  currentAnswerStatus: 'correct' | 'incorrect' | 'acceptable but not correct'
  /**
     * Updates whether or not the current guess from the
     * user is correct, wrong, or acceptable but not correct
     */
  changeCurrentAnswerStatus: (status: 'correct' | 'incorrect' | 'acceptable but not correct') => void
  /**
     * Updates if the blank for their guess is filled or not
     */
  changeAnswerHasBeenEntered: (entered: boolean) => void
  /**
     * Is the current input invalid
     */
  isInvalidInput: boolean
  /**
     * Changes the isInvalidInput state
     * @param isInvalidInput Is the current input invalid
     */
  changeIsInvalidInput: (isInvalidInput: boolean) => void
  /**
     * Does the input element have the invalid input class
     */
  hasInvalidInputClass: boolean
  /**
     * Changes the hasInvalidInputClass state
     * @param newVal - The new val that hasInvalidInputClass will take
     */
  changeHasInvalidInputClass: (newVal: boolean) => void
  changeGuessIsRightButWrongKana: (newVal: boolean) => void
  typingInHiragana: boolean
  isMultipleChoice: boolean
  handleAnswerSubmitOrHandleFinishedQuiz(): void 
}

/**
 * Handles Kana and Vocab questions
 */
export const KanaVocabQuestion = ({
  question,
  choiceSubmitted,
  // currentAnswerStatus,
  // changeCurrentAnswerStatus,
  // changeAnswerHasBeenEntered,
  // isInvalidInput,
  // changeIsInvalidInput,
  // hasInvalidInputClass,
  // changeHasInvalidInputClass,
  // changeGuessIsRightButWrongKana,
  // typingInHiragana,
  handleAnswerSubmitOrHandleFinishedQuiz,
  isMultipleChoice,
  ...props
}: KanaVocabQuestionProps): JSX.Element => {
  const [currentGuess, changeCurrentGuess] = useState('')
  const [hasNewQuestion, changeHasNewQuestion] = useState(false)

  const {
    questionContents,
    subjectData
  } = question

  const {
    japaneseSubjectType
  } = subjectData

  const {
    question: questionText
  } = questionContents

  useEffect(() => {
    changeHasNewQuestion(true)
  }, [question])

  useEffect(() => {
    if (!choiceSubmitted) { // reset user input if going to new Q
      changeCurrentGuess('')
    }
  }, [choiceSubmitted])

  return (
        <div data-testid='kana-vocab-question-container'>
            <h2
              className={`
              kana-vocab-question-text 
              ${`concept-and-explanation-container-for-${japaneseSubjectType}`}
              ${(questionText as string).length < 3 ? 'kana-vocab-question-text-few-chars' : 'kana-vocab-question-text-many-chars'}
              `}
            >
                {questionText}
            </h2>

            {isMultipleChoice
              ? (
                  <KanaVocabQuestionMultipleChoice
                    currentGuess={currentGuess}
                    changeCurrentGuess={changeCurrentGuess}
                    question={question}
                    choiceSubmitted={choiceSubmitted}
                    hasNewQuestion={hasNewQuestion}
                    handleAnswerSubmitOrHandleFinishedQuiz={handleAnswerSubmitOrHandleFinishedQuiz}
                    {...props}
                  />
                )
              : (
                  <>
                    <KanaVocabInputQuestion
                      question={question}
                      hasNewQuestion={hasNewQuestion}
                      changeHasNewQuestion={changeHasNewQuestion}
                      currentGuess={currentGuess}
                      changeCurrentGuess={changeCurrentGuess}
                      choiceSubmitted={choiceSubmitted}
                      {...props}
                    />
                  </>
                )}
        </div>
  )
}
