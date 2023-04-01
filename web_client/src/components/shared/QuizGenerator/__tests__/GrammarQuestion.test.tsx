import { GrammarQuestion } from '../GrammarQuestion'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const MockGrammarQuestion = ({
  choiceSubmitted
}: { choiceSubmitted: boolean }): JSX.Element => {
  return (
        <GrammarQuestion
            choiceSubmitted={choiceSubmitted}
            question={{
              questionPrompt: ' the corresponding English word',
              question: ['わたし', '', 'がくせい', '', '。'],
              answer: ['は', 'です'],
              explanationIfUserGetsIncorrect: 'test explanation',
              englishTranslation: [
                {
                  partToTranslate: false,
                  text: 'I '
                },
                {
                  partToTranslate: true,
                  text: 'am'
                },
                {
                  partToTranslate: false,
                  text: ' a school student. (Formal)'
                }
              ]
            }}
            currentAnswerStatus='incorrect'
            changeCurrentAnswerStatus={(_val) => {}}
            changeIsInvalidInput={(_val) => {}}
            hasInvalidInputClass={false}
        />
  )
}

describe('GrammarQuestion', () => {
  it('Inputs render properly', () => {
    render(<MockGrammarQuestion choiceSubmitted={false} />)
    expect(screen.queryAllByPlaceholderText('').length).toBe(2)
  })

  it('Inputs change with the input', async () => {
    render(<MockGrammarQuestion choiceSubmitted={false} />)
    const user = userEvent.setup()
    const [firstInput, secondInput] = screen.queryAllByPlaceholderText('')
    await userEvent.click(firstInput)
    await user.keyboard('na')
    await userEvent.click(secondInput)
    await user.keyboard('tesuto')
    expect(firstInput).toHaveValue('な')
    expect(secondInput).toHaveValue('てすと')
  })
})
