import { useEffect, useState } from 'react'
import { KeyboardTips } from '../KeyboardTips'
import { VOCABULARY_TYPE } from 'src/components/learning/lessons/SubjectTypes'
import { getPropsForSubjectsInfo } from '../../../learning/SubjectsSubInfo'
import { InputBar } from 'src/components/shared/InputBar'
import { toHiragana, toKatakana } from 'wanakana'
import levenshtein from 'damerau-levenshtein'
import { type QuizQuestion } from '../ConvertSubjectDataToQuestions'
import {
  type KanaVocabQuestionType
} from '../../../../context/JapaneseDatabaseContext/SharedVariables'

interface KanaVocabInputQuestionProps {
  question: QuizQuestion
  changeCurrentAnswerStatus: (status: 'correct' | 'incorrect' | 'acceptable but not correct') => void
  changeGuessIsRightButWrongKana: (newVal: boolean) => void
  changeAnswerHasBeenEntered: (entered: boolean) => void
  currentGuess: string
  changeCurrentGuess: (guess: string) => void
  typingInHiragana: boolean
  choiceSubmitted: boolean
  currentAnswerStatus: 'correct' | 'incorrect' | 'acceptable but not correct'
  changeIsInvalidInput: (isInvalidInput: boolean) => void
  hasInvalidInputClass: boolean
  hasNewQuestion: boolean
  changeHasNewQuestion: (hasNewQuestion: boolean) => void
}

export const KanaVocabInputQuestion = ({
  question,
  changeCurrentAnswerStatus,
  changeGuessIsRightButWrongKana,
  changeAnswerHasBeenEntered,
  currentGuess,
  changeCurrentGuess,
  typingInHiragana,
  choiceSubmitted,
  currentAnswerStatus,
  changeIsInvalidInput,
  hasInvalidInputClass,
  hasNewQuestion,
  changeHasNewQuestion
}: KanaVocabInputQuestionProps) => {
  const [acceptableResponseReason, changeAcceptableResponseReason] = useState('')
  const [showKeyboardTips, changeShowKeyboardTips] = useState(false)

  const {
    questionContents,
    // conceptAssociatedWith
    subjectData
  } = question

  const {
    japaneseSubjectType
  } = subjectData

  const {
    answers,
    answerIsInJapanese,
    acceptableResponsesButNotWhatLookingFor,
    inputPlaceholder
  } = questionContents as (KanaVocabQuestionType & {
    inputPlaceholder: string
  })

  useEffect(() => {
    let guessIsCorrect = false
    let guessIsRightButWrongKana = false
    const answerInCorrectFormat = currentGuess
    for (let i = 0; i < answers.length; i++) {
      const {
        answer,
        distanceToAllow
      } = answers[i]
      const lev = levenshtein(answerInCorrectFormat.toLowerCase(), answer.toLowerCase())
      if (lev.steps <= distanceToAllow) {
        guessIsCorrect = true
        break
      }
      // Check if it's just the kana that is wrong
      if (answerIsInJapanese && (currentGuess === toHiragana(answer) || currentGuess === toKatakana(answer))) {
        guessIsRightButWrongKana = true
      }
    }
    let guessIsAcceptable = false
    if (guessIsCorrect) {
      changeCurrentAnswerStatus('correct')
      changeGuessIsRightButWrongKana(false)
      changeAcceptableResponseReason('')
    } else if (guessIsRightButWrongKana) {
      changeGuessIsRightButWrongKana(true)
      changeAcceptableResponseReason('')
    } else {
      for (const {
        acceptableResponse,
        whyNotLookingFor
      } of acceptableResponsesButNotWhatLookingFor) {
        if ((currentGuess) === acceptableResponse) {
          guessIsAcceptable = true
          changeAcceptableResponseReason(whyNotLookingFor)
          break
        }
      }
      if (guessIsAcceptable) {
        changeCurrentAnswerStatus('acceptable but not correct')
      } else {
        changeAcceptableResponseReason('')
        changeCurrentAnswerStatus('incorrect')
      }
    }

    if (!guessIsAcceptable) {
      changeAnswerHasBeenEntered(currentGuess.length !== 0)
    }
  }, [
    currentGuess,
    typingInHiragana,
    acceptableResponsesButNotWhatLookingFor,
    answerIsInJapanese,
    answers,
    changeAnswerHasBeenEntered,
    changeCurrentAnswerStatus,
    changeGuessIsRightButWrongKana
  ])

  useEffect(() => {
    changeShowKeyboardTips(false)
  }, [question])

  return (
        <>
            {japaneseSubjectType === VOCABULARY_TYPE && inputPlaceholder === 'Reading' && (
                <div className='vocab-question-meaning-hint-for-kanji-words-with-multiple-readings'>
                ({getPropsForSubjectsInfo(subjectData, true).subjectMainDescription})
                </div>
            )}
            <div className='kana-vocab-question-subject-type-container'>
                <div className={`kana-vocab-question-subject-type concept-and-explanation-container-for-${japaneseSubjectType}`}>{japaneseSubjectType}</div>
                <div>{inputPlaceholder}</div>
            </div>
            <InputBar
                // inputRef={inputRef}
                className='kana-vocab-question-input-bar'
                choiceSubmitted={choiceSubmitted}
                currentAnswerStatus={currentAnswerStatus}
                changeCurrentGuess={changeCurrentGuess}
                answerIsInJapanese={answerIsInJapanese}
                currentGuess={currentGuess}
                changeIsInvalidInput={changeIsInvalidInput}
                hasInvalidInputClass={hasInvalidInputClass}
                typingInHiragana={typingInHiragana}
                hasNewQuestion={hasNewQuestion}
                changeHasNewQuestion={changeHasNewQuestion}
                placeholder={inputPlaceholder}
            />
            {answerIsInJapanese && (
            <div className='keyboard-info-container'>
                <div className='typing-in-hiragana-or-katakana-container'>
                    Typing in: <span className='typing-in-hiragana-or-katakana-indicator'>{typingInHiragana ? 'Hiragana' : 'Katakana'}</span>
                </div>
                {/* <div className='click-for-keyboard-tips' onClick={() => changeShowKeyboardTips(true)}>
                    Click for keyboard tips
                </div> */}
            </div>
            )}

            {showKeyboardTips && <KeyboardTips changeShowKeyboardTips={changeShowKeyboardTips} />}
            <div className={`frq-correct-answer ${choiceSubmitted || currentAnswerStatus === 'acceptable but not correct' ? 'frq-correct-answer-reveal' : ''}`}>
                {
                    currentAnswerStatus === 'acceptable but not correct'
                      ? acceptableResponseReason
                      : `Correct Answer: ${answers.slice(0, 5).map(({ answer }) => answer).join(', ')}`
                }
            </div>
        </>
  )
}
