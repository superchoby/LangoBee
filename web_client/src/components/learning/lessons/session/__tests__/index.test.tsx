import { Lesson, getSubheader } from '../index'
import { screen } from '@testing-library/react'
import { renderWithProviders } from 'src/__mocks__/Provider'
import { BrowserRouter } from 'react-router-dom'
import { JapaneseDatabaseProvider } from '../../../../context/JapaneseDatabaseContext/JapaneseDatabaseContext'
import { server } from 'src/__mocks__/server'

const MockLesson = (): JSX.Element => {
  return (
        <BrowserRouter>
            <JapaneseDatabaseProvider>
                <Lesson
                    lessonId={3}
                    currentSplit={2}
                    conceptType='Hiragana'
                    changeConceptType={(_: string) => {}}
                />
            </JapaneseDatabaseProvider>
        </BrowserRouter>
  )
}

describe('Lesson', () => {
  beforeAll(() => { server.listen({ onUnhandledRequest: 'bypass' }) })

  it('Renders Properly with Header', () => {
    renderWithProviders(<MockLesson />)
    const headerElement = screen.queryByRole('heading', { level: 2 })
    expect(headerElement).toBeInTheDocument()
  })

  it('Get Subheader Function returns right headers', () => {
    const conceptTypes = ['Hiragana', 'Katakana', 'Vocabulary', 'Grammar'] as const
    for (const conceptType of conceptTypes) {
      expect(getSubheader(conceptType, 'learning')).toEqual(`This Lesson's ${conceptType}`)
    }
    expect(getSubheader('Hiragana', 'FR Questions')).toEqual('Free Response Quiz')
  })

  // it('Shows learning subsection at first then goes to quiz afterwards', () => {
  //   renderWithProviders(<MockLesson />)
  //   const forwardButton = screen.getByLabelText('Forward Button')
  //   fireEvent.click(forwardButton)
  //   fireEvent.click(forwardButton)
  //   fireEvent.click(forwardButton)
  //   fireEvent.click(forwardButton)
  //   fireEvent.click(forwardButton)

  //   const startQuizButton = screen.getByText('Quiz Me!')
  //   fireEvent.click(startQuizButton)
  //   const quizSectionContainer = screen.queryByTestId('quiz-generator-container')
  //   expect(quizSectionContainer).toBeInTheDocument()
  // })
})
