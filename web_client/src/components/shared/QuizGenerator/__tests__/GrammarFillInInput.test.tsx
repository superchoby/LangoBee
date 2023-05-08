import { GrammarFillInInput } from '../GrammarFillInInput'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRef, useState } from 'react'

const MockGrammarFillInInput = ({
  choiceSubmitted
}: { choiceSubmitted: boolean }) => {
  const inputRef = useRef(null)
  const [mockGrammarFillInputTextIsCorrect, changeMockGrammarFillInputTextIsCorrect] = useState({ 0: false })
  const [mockGrammarFillInputTextIsInvalid, changeMockGrammarFillInputTextIsInvalid] = useState({ 0: false })

  return (
        <GrammarFillInInput
            grammarFillInputTextIsCorrect={mockGrammarFillInputTextIsCorrect}
            grammarFillInputTextIsInvalid={mockGrammarFillInputTextIsInvalid}
            idx={0}
            answer='テスト'
            choiceSubmitted={choiceSubmitted}
            question={{
              questionPrompt: ' the corresponding English word',
              question: [''],
              answer: ['test answer'],
              explanationIfUserGetsIncorrect: 'test explanation',
              englishTranslation: [{
                partToTranslate: true,
                text: ''
              }]
            }}
            autoFocus={true}
            hasInvalidInputClass={false}
            updateAnswerCorrectStatus={(_idx, isInvalid) => {
              changeMockGrammarFillInputTextIsCorrect({
                0: isInvalid
              })
            }}
            updateInputIsInvalidStatus={(_idx, isInvalid) => {
              changeMockGrammarFillInputTextIsInvalid({
                0: isInvalid
              })
            }}
            inputRef={inputRef}
        />
  )
}

describe('GrammarFillInInput', () => {
  it('Renders Properly', () => {
    render(<MockGrammarFillInInput choiceSubmitted={false} />)
    const inputElement = screen.queryByPlaceholderText('')
    expect(inputElement).toBeInTheDocument()
  })

  it('Input becomes red when invalid answer is submitted and correct answer shows', () => {
    const { rerender, container } = render(<MockGrammarFillInInput choiceSubmitted={false} />)
    const inputElement = screen.getByPlaceholderText('')
    fireEvent.change(inputElement, { target: { value: 'テ' } })
    rerender(<MockGrammarFillInInput choiceSubmitted={true} />)
    expect(container.getElementsByClassName('grammar-incorrectAnswer').length).toBe(1)
    const answerElement = screen.queryByText('テスト')
    expect(answerElement).toBeInTheDocument()
  })

  it('Input becomes green when valid answer is submitted', () => {
    const { rerender, container } = render(<MockGrammarFillInInput choiceSubmitted={false} />)
    const inputElement = screen.getByPlaceholderText('')
    fireEvent.change(inputElement, { target: { value: 'テスト' } })
    rerender(<MockGrammarFillInInput choiceSubmitted={true} />)
    expect(container.getElementsByClassName('grammar-correct-answer').length).toBe(1)
  })
})
