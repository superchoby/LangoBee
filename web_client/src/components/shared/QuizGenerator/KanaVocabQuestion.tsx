import { useState, useEffect } from 'react'
import './KanaVocabQuestion.scss'
import { toHiragana, toKatakana } from 'wanakana'
import levenshtein from 'damerau-levenshtein'
import {
  KanaVocabQuestionType,
} from '../../../context/JapaneseDatabaseContext/SharedVariables'
import useSound from 'use-sound'
import { useAppSelector } from '../../../app/hooks'
import { InputBar } from 'src/components/shared/InputBar'
import 'react-dropdown/style.css'
import { KeyboardTips } from './KeyboardTips'
import { QuizQuestion } from './ConvertSubjectDataToQuestions'
import { AUDIO_FILE_BASE_URL } from '../values'

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
}

/**
 * Handles Kana and Vocab questions
 */
export const KanaVocabQuestion = ({
  question,
  choiceSubmitted,
  currentAnswerStatus,
  changeCurrentAnswerStatus,
  changeAnswerHasBeenEntered,
  isInvalidInput,
  changeIsInvalidInput,
  hasInvalidInputClass,
  changeHasInvalidInputClass,
  changeGuessIsRightButWrongKana,
  typingInHiragana
}: KanaVocabQuestionProps): JSX.Element => {
  const [currentGuess, changeCurrentGuess] = useState('')
  const [acceptableResponseReason, changeAcceptableResponseReason] = useState('')
  const [showKeyboardTips, changeShowKeyboardTips] = useState(false)
  const [showExtraInfo, changeShowExtraInfo] = useState(false)
  const [hasNewQuestion, changeHasNewQuestion] = useState(false)

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
    question: questionText,
    answerIsInJapanese,
    acceptableResponsesButNotWhatLookingFor,
    inputPlaceholder,
    pronunciationFile,
  } = questionContents as (KanaVocabQuestionType & {
    inputPlaceholder: string
  })

  const [play] = useSound(pronunciationFile.length > 0 ? `${AUDIO_FILE_BASE_URL}${pronunciationFile}` : '.mp4')

  useEffect(() => {
    changeShowExtraInfo(false)
    changeShowKeyboardTips(false)
    changeHasNewQuestion(true)
  }, [question])

  useEffect(() => {
    if (!choiceSubmitted) { // reset user input if going to new Q
      changeCurrentGuess('')
    } else {
      console.log('shoudl be playin')
      play()
    }
  }, [choiceSubmitted, play])

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

  // const lessThanLesson7AndHiraganaQues = currentLesson < 7 && isHiragana(questionText as string)
  // const lessThanLesson16AndKatakanaQues = currentLesson < 16 && isKatakana(questionText as string)
  return (
        <div data-testid='kana-vocab-question-container'>
            <h2 
              className={`
              kana-vocab-question-text 
              ${`concept-and-explanation-container-for-${japaneseSubjectType}`}
              ${questionText.length < 3 ? 'kana-vocab-question-text-few-chars' : 'kana-vocab-question-text-many-chars'}
              `}
            >
                {questionText}
                {/* {(conceptType === 'Vocabulary' && (lessThanLesson7AndHiraganaQues || lessThanLesson16AndKatakanaQues) &&
                <div className='romaji-explanation'>
                    {toRomaji(questionText as string)}
                </div>)} */}
            </h2>
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
        </div>
  )
}
