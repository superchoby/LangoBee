import React, { useState, useEffect, useRef } from 'react'
import { toHiragana, toRomaji, isHiragana } from 'wanakana'
import './GrammarFillInInput.scss'

interface GrammarFillInInputProps {
  /**
     * Object containing all the input components and their
     * associated index in the question string
     */
  grammarFillInputTextIsCorrect: { [idx: number]: boolean }
  grammarFillInputTextIsInvalid: { [idx: number]: boolean }
  /**
     * Current idx that the user is on
     */
  idx: number
  /**
     * The answer to the input component
     */
  answer: string
  /**
     * Whether or not the user has submitted their answer
     */
  choiceSubmitted: boolean
  /**
     * Updates whether or not the answer for the current
     * input component is correct
     * @param idx - Idx of the input component
     * @param isCorrect - Whether or not what the user entered is correct
     */
  updateAnswerCorrectStatus: (idx: number, isCorrect: boolean) => void
  autoFocus: boolean
  updateInputIsInvalidStatus: (idx: number, isInvalid: boolean) => void
  hasInvalidInputClass: boolean
  /**
     * Stores the reference for the input, only concerned with the first
     * GrammarFillInInput generated so that it can be focused on so
     * if this isn't the first element, then it will be null
     */
  isFirstInput: boolean
  // changeOnANewQuestion(onANewQuestion: boolean): void 
  // onANewQuestion: boolean
  questionText: string
}

/**
 * Input component for the grammar questions
 */
export const GrammarFillInInput = ({
  grammarFillInputTextIsCorrect,
  grammarFillInputTextIsInvalid,
  idx,
  answer,
  choiceSubmitted,
  autoFocus,
  hasInvalidInputClass,
  updateAnswerCorrectStatus,
  updateInputIsInvalidStatus,
  isFirstInput,
  questionText
  // changeOnANewQuestion,
  // onANewQuestion,
}: GrammarFillInInputProps): JSX.Element => {
  const [currentGuess, changeCurrentGuess] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    changeCurrentGuess('')

    if (inputRef.current != null) {
      inputRef.current.focus()
    }
  }, [questionText])

  const handleInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!choiceSubmitted) {
      const newGuess = value.length > currentGuess.length ? (currentGuess.concat(value.charAt(value.length - 1))).toLowerCase() : toRomaji(value)
      changeCurrentGuess(newGuess)
      updateAnswerCorrectStatus(idx, toHiragana(newGuess) === answer)
      updateInputIsInvalidStatus(idx, !isHiragana(toHiragana(newGuess)) || newGuess === '')
    }
  }

  return (
        <div className='grammar-fill-in-input-container'>
            <input
                autoCapitalize='none'
                autoFocus={autoFocus}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                onChange={handleInputChange}
                value={toHiragana(currentGuess)}
                className={`
                grammar-fill-in-input 
                ${choiceSubmitted ? (`${grammarFillInputTextIsCorrect[idx] ? 'grammar-correct-answer' : 'grammar-incorrectAnswer'}`) : ''}
                ${(hasInvalidInputClass && grammarFillInputTextIsInvalid[idx]) ? 'invalid-input-grammar' : ''}
                `}
                style={{
                  width: `${currentGuess.length + 3}ch`
                }}
                ref={isFirstInput ? inputRef : null}
                placeholder='' // used to query this element in tests
            />
            <span className='grammar-correct-answer'>{choiceSubmitted ? (`${grammarFillInputTextIsCorrect[idx] ? '' : answer}`) : ''}</span>
        </div>
  )
}
