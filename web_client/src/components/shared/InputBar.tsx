import { toHiragana, toKatakana, isHiragana, isKatakana, isJapanese } from 'wanakana'
import { useEffect, useRef, useState } from 'react'
import './InputBar.scss'
import unbind from './QuizGenerator/src/unbind'
import bind from './QuizGenerator/src/bind'

export type AnswerStatus = 'correct' | 'incorrect' | 'acceptable but not correct'

interface InputBarProps {
  // inputRef: RefObject<HTMLInputElement>;
  /**
   * Custom classname to take
   */
  className: string
  /**
   * Has the choice been submitted
   */
  choiceSubmitted: boolean
  /**
   * Current status of answer
   */
  currentAnswerStatus: AnswerStatus
  /**
   * Changes the users input state
   * @param value Users current input
   */
  changeCurrentGuess: (value: string) => void
  answerIsInJapanese: boolean
  currentGuess: string
  changeIsInvalidInput: (isInvalidInput: boolean) => void
  /**
   * Does the input element have the invalid input class
   */
  hasInvalidInputClass: boolean
  typingInHiragana: boolean
  hasNewQuestion: boolean
  changeHasNewQuestion: (hasNewQuestion: boolean) => void
  placeholder: string
}

function usePrevious (value: Function): Function | undefined {
  const ref = useRef<Function>()
  useEffect(() => {
    ref.current = value // assign the value of ref to the argument
  }, [value]) // this code will run when the value of 'value' changes
  return ref.current // in the end, return the current ref value.
}
export default usePrevious

function hasSpecialChars (str: string): boolean {
  return /[~`@!#$%^&*+=\-[\]\\';,/{}|\\"<>?]/g.test(str)
}

export const inputIsInvalid = (value: string, answerIsInJapanese: boolean): boolean => {
  if (value.length === 0) {
    return true
  }
  let hasHiragana = false
  let hasKatakana = false
  let hasANumber = false
  let hasEnglish = false

  for (const char of value) {
    if (isHiragana(char) && char !== 'ー') {
      hasHiragana = true
    } else if (isKatakana(char) && char !== 'ー') {
      hasKatakana = true
    } else if ('1234567890'.includes(char)) {
      hasANumber = true
    } else if (/^[a-zA-Z]+$/.test(char)) {
      hasEnglish = true
    }
  }

  const hasHiraganaAndKatakana = hasHiragana && hasKatakana
  const answerIsJapaneseAndHasNoKana =
    answerIsInJapanese && !hasHiragana && !hasKatakana
  const answerIsEnglishAndHasKana =
    !answerIsInJapanese && (hasHiragana || hasKatakana)
  const answerIsJapaneseAndHasANum = hasANumber && answerIsInJapanese
  const answerIsJapaneseAndHasEnglish = answerIsInJapanese && hasEnglish

  if (
    hasHiraganaAndKatakana ||
    answerIsJapaneseAndHasNoKana ||
    answerIsEnglishAndHasKana ||
    answerIsJapaneseAndHasANum ||
    hasSpecialChars(value) ||
    answerIsJapaneseAndHasEnglish
  ) {
    return true
  }

  return false
}

export const InputBar = ({
  className,
  choiceSubmitted,
  currentAnswerStatus,
  changeCurrentGuess,
  answerIsInJapanese,
  currentGuess,
  changeIsInvalidInput,
  hasInvalidInputClass,
  typingInHiragana,
  hasNewQuestion,
  changeHasNewQuestion,
  placeholder
}: InputBarProps): JSX.Element => {
  const [hasBindedInput, changeHasBindedInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    changeIsInvalidInput(inputIsInvalid(currentGuess, answerIsInJapanese))
  }, [
    currentGuess,
    answerIsInJapanese,
    typingInHiragana,
    changeIsInvalidInput
  ])

  useEffect(() => {
    if (inputRef.current != null && hasNewQuestion) {
      changeHasNewQuestion(false)
      inputRef.current.focus()
      inputRef.current.value = ''
      if (hasBindedInput && !answerIsInJapanese) {
        unbind(inputRef.current)
        changeHasBindedInput(false)
      }
    }
  }, [hasNewQuestion, hasBindedInput, answerIsInJapanese, changeHasNewQuestion])

  useEffect(() => {
    if (inputRef.current != null) {
      if (answerIsInJapanese) {
        if (hasBindedInput) {
          unbind(inputRef.current)
        }
        bind(changeCurrentGuess, inputRef.current, {
          IMEMode: typingInHiragana ? 'toHiragana' : 'toKatakana'
        })
        changeHasBindedInput(true)
      }
    }
  }, [
    answerIsInJapanese,
    hasBindedInput,
    changeCurrentGuess,
    typingInHiragana
  ])

  useEffect(() => {
    if ((inputRef.current != null) && answerIsInJapanese) {
      const convertedInput = []
      for (const char of currentGuess) {
        convertedInput.push(isJapanese(char) ? (typingInHiragana ? toHiragana(char) : toKatakana(char)) : char)
      }
      const joinedValue = convertedInput.join('')
      changeCurrentGuess(joinedValue)
      inputRef.current.value = joinedValue
    }
  }, [
    answerIsInJapanese,
    typingInHiragana,
    changeCurrentGuess,
    currentGuess
  ])

  return (
      <input
          autoCapitalize='none'
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={`
          input-bar 
          ${
            choiceSubmitted &&
            currentAnswerStatus !== 'acceptable but not correct'
              ? currentAnswerStatus === 'correct'
                ? 'input-answer-correct'
                : 'input-answer-incorrect'
              : ''
          }
          ${className}
          ${hasInvalidInputClass ? 'invalid-input' : ''}
          `}
          onChange={({ target: { value } }) => {
            if (!choiceSubmitted && !answerIsInJapanese) {
              changeCurrentGuess(value)
            }
          }}
          value={!answerIsInJapanese ? currentGuess : undefined}
          ref={inputRef}
          placeholder={placeholder}
      />
  )
}
