import {
  ConjugationQuestion,
  getConjugationFormality
} from '../ConjugationQuestion'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'

const extraInfoTestHeader = 'extra info test header'
const extraInfoTestExplanation = 'extra info test explanation'
const testQuestion = 'test question'
const testKanaVersion = 'てすと'
const testKanjiVersion = 'またてすと'
const testExplanationIfUserGetsIncorrect = 'test explanation if user gets incorrect'
const testConjugationType = 'ます'

const MockConjugationQuestion = ({
  choiceSubmitted,
  changeAnswerHasBeenEntered
}: {
  choiceSubmitted?: boolean
  changeAnswerHasBeenEntered?: (val: boolean) => void
}): JSX.Element => {
  const [currentAnswerStatus, changeCurrentAnswerStatus] = useState<'correct' | 'incorrect' | 'acceptable but not correct'>('incorrect')

  return (
        <ConjugationQuestion
            question={{
              conjugationType: testConjugationType,
              extraInfo: [{
                header: extraInfoTestHeader,
                explanation: extraInfoTestExplanation
              }],
              questionPrompt: 'Convert the word to the proper conjugation',
              question: testQuestion,
              answer: {
                kana: testKanaVersion,
                kanji: testKanjiVersion
              },
              explanationIfUserGetsIncorrect: testExplanationIfUserGetsIncorrect
            }}
            choiceSubmitted={choiceSubmitted ?? false}
            currentAnswerStatus={currentAnswerStatus}
            changeCurrentAnswerStatus={changeCurrentAnswerStatus}
            changeAnswerHasBeenEntered={changeAnswerHasBeenEntered ?? (() => {})}
            changeIsInvalidInput={() => {}}
            hasInvalidInputClass={false}
        />
  )
}

describe('ConjugationQuestion', () => {
  const user = userEvent.setup()

  it('Question text renders with the conjugation formality', () => {
    render(<MockConjugationQuestion />)
    expect(screen.queryByText(testQuestion)).toBeInTheDocument()
    expect(screen.queryByText(`(${getConjugationFormality(testConjugationType)})`)).toBeInTheDocument()
  })

  it('Answer choice is recognized as submitted when there is input', async () => {
    const mockChangeAnswerBeenEntered = jest.fn()
    render(<MockConjugationQuestion changeAnswerHasBeenEntered={mockChangeAnswerBeenEntered} />)
    await act(async () => { await user.keyboard('random input') })
    expect(mockChangeAnswerBeenEntered).toHaveBeenCalledWith(true)
  })

  describe('properly handles when the user submits a correct answer', () => {
    const verifyProperTextShowsInCaseOfCorrectAnswer = (): void => {
      expect(screen.queryByText(`Correct Answer: ${testKanjiVersion}, ${testKanaVersion}`)).toBeInTheDocument()
      expect(screen.queryByText(testExplanationIfUserGetsIncorrect)).not.toBeVisible()
      expect(screen.queryByText('View More')).toBeInTheDocument()
    }

    it('for the kana version', async () => {
      const { rerender } = render(<MockConjugationQuestion />)
      await act(async () => { await user.keyboard(testKanaVersion) })
      rerender(<MockConjugationQuestion choiceSubmitted={true} />)
      verifyProperTextShowsInCaseOfCorrectAnswer()
    })

    it('for the kanji version', async () => {
      const { rerender } = render(<MockConjugationQuestion />)
      await act(async () => { await user.keyboard(testKanjiVersion) })
      rerender(<MockConjugationQuestion choiceSubmitted={true} />)
      verifyProperTextShowsInCaseOfCorrectAnswer()
    })
  })

  it('Properly handles when a user submits an incorrect answer', async () => {
    const { rerender } = render(<MockConjugationQuestion />)
    await act(async () => { await user.keyboard('wrong guess') })
    rerender(<MockConjugationQuestion choiceSubmitted={true} />)
    expect(screen.queryByText(`Correct Answer: ${testKanjiVersion}, ${testKanaVersion}`)).toBeInTheDocument()
    expect(screen.queryByText(testExplanationIfUserGetsIncorrect)).toBeVisible()
    expect(screen.queryByText('View More')).toBeInTheDocument()
  })

  it('View More button shows the correct info', async () => {
    const { rerender } = render(<MockConjugationQuestion />)
    await act(async () => { await user.keyboard(testKanaVersion) })
    rerender(<MockConjugationQuestion choiceSubmitted={true} />)
    fireEvent.click(screen.getByText('View More'))
    expect(screen.queryByText(extraInfoTestHeader + ':')).toBeInTheDocument()
    expect(screen.queryByText(extraInfoTestExplanation)).toBeInTheDocument()
    expect(screen.queryByText('View More')).not.toBeInTheDocument()
  })
})
