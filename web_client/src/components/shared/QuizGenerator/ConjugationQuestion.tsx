import { useState, useEffect } from 'react'
import './KanaVocabQuestion.scss'
import {
  ConjugationQuestionType,
  ExtraInfo,
  ConjugationType
} from '../../../context/JapaneseDatabaseContext/SharedVariables'
import { InputBar } from 'src/components/shared/InputBar'
import 'react-dropdown/style.css'

export interface questionType extends ConjugationQuestionType {
  conjugationType: ConjugationType
  extraInfo: ExtraInfo[]
}

interface ConjugationQuestionProps {
  question: questionType
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
     * Changes the isInvalidInput state
     * @param isInvalidInput Is the current input invalid
     */
  changeIsInvalidInput: (isInvalidInput: boolean) => void
  /**
     * Does the input element have the invalid input class
     */
  hasInvalidInputClass: boolean
}

export const getConjugationFormality = (conjugationType: ConjugationType): 'Formal' | 'Casual' | '' => {
  const formalConjugations: ConjugationType[] = ['ます']
  const informalConjugations: ConjugationType[] = ['ない']

  if (formalConjugations.includes(conjugationType)) {
    return 'Formal'
  } else if (informalConjugations.includes(conjugationType)) {
    return 'Casual'
  }

  return ''
}

/**
 * Handles conjugation questions
 */
export const ConjugationQuestion = ({
  question,
  choiceSubmitted,
  currentAnswerStatus,
  changeCurrentAnswerStatus,
  changeAnswerHasBeenEntered,
  changeIsInvalidInput,
  hasInvalidInputClass
}: ConjugationQuestionProps): JSX.Element => {
  const [currentGuess, changeCurrentGuess] = useState('')
  const [showExtraInfo, changeShowExtraInfo] = useState(false)
  const [hasNewQuestion, changeHasNewQuestion] = useState(false)

  const {
    question: questionText,
    answer,
    explanationIfUserGetsIncorrect,
    extraInfo,
    conjugationType
  } = question

  useEffect(() => {
    changeShowExtraInfo(false)
    changeHasNewQuestion(true)
  }, [question])

  useEffect(() => {
    if (!choiceSubmitted) { // reset user input if going to new Q
      changeCurrentGuess('')
    }
  }, [choiceSubmitted])

  useEffect(() => {
    if (currentGuess === answer.kana || currentGuess === answer.kanji) {
      changeCurrentAnswerStatus('correct')
    } else {
      changeCurrentAnswerStatus('incorrect')
    }

    changeAnswerHasBeenEntered(currentGuess.length > 0)
  }, [
    currentGuess,
    answer,
    changeAnswerHasBeenEntered,
    changeCurrentAnswerStatus
  ])

  return (
        <div>
            <div className='actual-question multiple-char-question-text'>
                {questionText}
                <div className='question-type-abbreviation'>
                    ({getConjugationFormality(conjugationType)})
                </div>
            </div>
            {/* <InputBar
                className='kana-vocab-question-input-bar'
                choiceSubmitted={choiceSubmitted}
                currentAnswerStatus={currentAnswerStatus}
                changeCurrentGuess={changeCurrentGuess}
                answerIsInJapanese={true}
                currentGuess={currentGuess}
                changeIsInvalidInput={changeIsInvalidInput}
                hasInvalidInputClass={hasInvalidInputClass}
                typingInHiragana={true}
                hasNewQuestion={hasNewQuestion}
                changeHasNewQuestion={changeHasNewQuestion}
            /> */}
            <div className={`frq-correct-answer ${choiceSubmitted && currentAnswerStatus !== 'acceptable but not correct' ? 'frq-correct-answer-reveal' : ''}`}>
                Correct Answer: {answer.kanji === answer.kana ? answer.kana : `${answer.kanji}, ${answer.kana}`} <br />
                <span style={{ visibility: (choiceSubmitted && currentAnswerStatus === 'incorrect') ? 'visible' : 'hidden' }}>
                  {explanationIfUserGetsIncorrect}
                </span>
            </div>
            {
                showExtraInfo
                  ? (
                      <div className='extra-info-on-question-container'>
                        {extraInfo.map(({ header, explanation }) =>
                            <div key={header}>
                                <div className='extra-info-header-on-question'>{header}:</div>
                                <div className='extra-info-explanation-on-question'>{explanation}</div>
                            </div>
                        )}
                      </div>
                    )
                  : (
                      <div
                          className='view-more-info-button'
                          style={{ visibility: choiceSubmitted ? 'visible' : 'hidden', display: extraInfo.length > 0 ? 'block' : 'none' }}
                          onClick={() => changeShowExtraInfo(true)}
                      >
                          View More
                      </div>
                    )
            }
        </div>
  )
}
