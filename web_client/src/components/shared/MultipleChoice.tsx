import { useState, useEffect } from 'react'
import shuffle from 'shuffle-array'
import './MultipleChoice.scss'

interface MultipleChoiceOptionProps {
  text: string
  changeValueSelected: () => void
  isTheAnswer: boolean
  valueSelected: string
  choiceSubmitted: boolean
  handleAnswerSubmitOrHandleFinishedQuiz(): void 
}

const MultipleChoiceOption = ({
  text,
  changeValueSelected,
  isTheAnswer,
  valueSelected,
  choiceSubmitted,
  handleAnswerSubmitOrHandleFinishedQuiz
}: MultipleChoiceOptionProps) => {
  const thisChoiceIsSelected = valueSelected === text
  const selectedClassName = thisChoiceIsSelected ? 'selected-choice' : 'non-selected-choice'
  const rightOrWrongClassname = (choiceSubmitted && thisChoiceIsSelected) ? (isTheAnswer ? 'multiple-choice-correct-answer' : 'multiple-choice-wrong-answer') : ''
  return (
    <button 
      className={`${selectedClassName} multiple-choice-option ${rightOrWrongClassname}`} 
      onClick={() => {
        changeValueSelected()
        handleAnswerSubmitOrHandleFinishedQuiz()
        // changeChoiceHasBeenSubmitted(true)
      }}
    >
        {text}
    </button>
  )
}

interface MultipleChoiceProps {
  answer: string
  wrongChoices: string[]
  valueSelected: string
  changeValueSelected: (value: string) => void
  choiceSubmitted: boolean
  handleAnswerSubmitOrHandleFinishedQuiz(): void 
}

export const MultipleChoice = ({
  answer,
  wrongChoices,
  valueSelected,
  changeValueSelected,
  choiceSubmitted,
  handleAnswerSubmitOrHandleFinishedQuiz
}: MultipleChoiceProps) => {
  const [choicesOrder, changeChoicesOrder] = useState<Array<{ text: string, isTheAnswer: boolean }>>([])

  useEffect(() => {
    if (wrongChoices.length > 0) {
      changeChoicesOrder(shuffle([{ text: answer, isTheAnswer: true }, ...wrongChoices.slice(0, 3).map(choice => ({ text: choice, isTheAnswer: false }))]))
    }
  }, [wrongChoices.length, answer, wrongChoices])

  return (
    <div className='multiple-choice-grid'>
      {choicesOrder.map(({ text, isTheAnswer }) => (
        <MultipleChoiceOption
          key={text}
          text={text}
          isTheAnswer={isTheAnswer}
          changeValueSelected={() => { changeValueSelected(text) }}
          valueSelected={valueSelected}
          choiceSubmitted={choiceSubmitted}
          handleAnswerSubmitOrHandleFinishedQuiz={handleAnswerSubmitOrHandleFinishedQuiz}
        />
      ))}
    </div>
  )
}