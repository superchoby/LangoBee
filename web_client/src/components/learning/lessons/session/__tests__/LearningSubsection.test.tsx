import { LearningSubsection, type LearningCardProp } from '../LessonLearning'
import { screen, fireEvent } from '@testing-library/react'
import { CORRESPONDING_HIRAGANA_HEADER } from '../../../../context/JapaneseDatabaseContext/SharedVariables'
import { renderWithProviders } from '../../../../__mocks__/Provider'

interface MockLearningSubsectionProps {
  cards: LearningCardProp[]
  startQuiz: () => void
}

const MockLearningSubsection = ({
  cards,
  startQuiz
}: MockLearningSubsectionProps): JSX.Element => {
  return (
        <LearningSubsection
            cards={cards}
            startQuiz={startQuiz}
            conceptType='Hiragana'
        />
  )
}

describe('Learning Subsection', () => {
  const dummyCard: LearningCardProp = {
    concept: 'test concept',
    explanationHeader: CORRESPONDING_HIRAGANA_HEADER,
    explanation: 'test explanation',
    extraInfoList: [{
      header: 'test header',
      explanation: 'test extra info explanation'
    }]
  }

  it('Renders properly', () => {
    renderWithProviders(<MockLearningSubsection cards={[]} startQuiz={() => {}}/>)
    const explanationButton = screen.queryByText('Hide Explanations')
    expect(explanationButton).toBeInTheDocument()
  })

  it('Start Quiz Button works after navigating to the end and forward button becomes invisible', () => {
    const startQuiz = jest.fn()
    renderWithProviders(<MockLearningSubsection cards={[dummyCard, dummyCard]} startQuiz={startQuiz}/>)
    let quizMeButton = screen.queryByText('Quiz Me!')
    expect(quizMeButton).not.toBeInTheDocument()
    const forwardButton = screen.getByLabelText('Forward Button')
    fireEvent.click(forwardButton)
    expect(forwardButton).not.toBeVisible()
    quizMeButton = screen.getByText('Quiz Me!')
    expect(quizMeButton).toBeInTheDocument()
    fireEvent.click(quizMeButton)
    expect(startQuiz).toHaveBeenCalled()
  })

  it('Explanations are properly hidden and can appear again', () => {
    renderWithProviders(<MockLearningSubsection cards={[dummyCard]} startQuiz={() => {}}/>)
    let testExplanationElement = screen.getByText('test explanation')
    const hideOrShowExplanationsButton = screen.getByText('Hide Explanations')
    fireEvent.click(hideOrShowExplanationsButton)
    expect(testExplanationElement).not.toBeInTheDocument()
    expect(hideOrShowExplanationsButton).toHaveTextContent('Show Explanations')
    fireEvent.click(hideOrShowExplanationsButton)
    testExplanationElement = screen.getByText('test explanation')
    expect(testExplanationElement).toBeInTheDocument()
  })
})
