import { useState, useEffect } from 'react'
import shuffle from 'shuffle-array'

interface MultipleChoiceOptionProps {
  text: string
  changeValueSelected: () => void
}

const MultipleChoiceOption = ({
  text,
  changeValueSelected
}: MultipleChoiceOptionProps) => {
  return (
        <button onClick={changeValueSelected}>
            {text}
        </button>
  )
}

interface MultipleChoiceProps {
  answer: string
  wrongChoices: string[]
  valueSelected: string
  changeValueSelected: (value: string) => void
}

export const MultipleChoice = ({
  answer,
  wrongChoices,
  valueSelected,
  changeValueSelected
}: MultipleChoiceProps) => {
  const [choicesOrder, changeChoicesOrder] = useState<Array<{ text: string, isTheAnswer: boolean }>>([])

  useEffect(() => {
    if (wrongChoices.length > 0) {
      changeChoicesOrder(shuffle([{ text: answer, isTheAnswer: true }, ...wrongChoices.map(choice => ({ text: choice, isTheAnswer: false }))]))
    }
  }, [wrongChoices.length])

  return (
        <div>asdfa;</div>
  )
}
