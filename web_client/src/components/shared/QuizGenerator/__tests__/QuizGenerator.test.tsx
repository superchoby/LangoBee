import {
  QuizGenerator,
  QuizGeneratorProps
} from '..'
import { JapaneseDatabaseProvider } from 'src/context/JapaneseDatabaseContext/JapaneseDatabaseContext'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from 'src/__mocks__/Provider'
import { BrowserRouter } from 'react-router-dom'
import { server } from 'src/__mocks__/server'
import { Content as LessonOneContent } from 'src/context/JapaneseDatabaseContext/EachLessonsContent/1'
import {
  KanaVocabQuestionType,
  GrammarQuestionType
} from 'src/context/JapaneseDatabaseContext/SharedVariables'
import LessonTenContent from 'src/context/JapaneseDatabaseContext/EachLessonsContent/10'
import { srsCardLevelNames } from '../NewSRSCardLevelMsg'

const TEST_CONCEPT_TO_USE_FOR_KANA_VOCAB = 'あ-ひらがな'
const TEST_CONCEPT_TO_USE_FOR_GRAMMAR = 'これ-文法'
const TEST_COMPLETION_MESSAGE = 'completion message'
const srsLevelToUse: keyof typeof srsCardLevelNames = 4
const MockQuizGenerator = ({
  content,
  submitQuestionsData,
  onQuizFinish,
  onHomeOrNextClick
}: Partial<QuizGeneratorProps>): JSX.Element => {
  return (
        <BrowserRouter>
            <JapaneseDatabaseProvider>
                <QuizGenerator
                    content={content ?? []}
                    currentLevelForEachConcept={{
                      [(content ?? ['word'])[0]]: srsLevelToUse
                    }}
                    errorOccurredWhileSubmittingQuestionInfo={false}
                    submitQuestionsData={submitQuestionsData ?? (() => {})}
                    showNextButton={false}
                    onQuizFinish={onQuizFinish ?? (() => {})}
                    onHomeOrNextClick={onHomeOrNextClick ?? (() => {})}
                    completionMessage={TEST_COMPLETION_MESSAGE}
                    isLearning={false}
                />
            </JapaneseDatabaseProvider>
        </BrowserRouter>
  )
}

const testNames = {
  submitsData: "Submits a question's data when finished with the question",
  callsClosingFunc: 'Calls the final function after all questions finished',
  showsSrsLevelUp: 'Shows new srs level up after finish question correctly',
  showsSrsLevelDown: 'Shows new srs level down after finish question correctly'
}

describe('MockQuizGenerator', () => {
  const user = userEvent.setup()
  beforeAll(() => server.close())

  it('Default elements render that render for any type of question', async () => {
    renderWithProviders(<MockQuizGenerator content={[TEST_CONCEPT_TO_USE_FOR_KANA_VOCAB]} />)
    expect(screen.queryByRole('progressbar')).toBeInTheDocument()
    expect(screen.queryByText('Check')).toBeInTheDocument()
  })

  describe('KanaVocab Question', () => {
    const testConceptToUseForKanaVocabQuestion = LessonOneContent[TEST_CONCEPT_TO_USE_FOR_KANA_VOCAB].Questions[0] as KanaVocabQuestionType
    it('Properly renders', async () => {
      renderWithProviders(<MockQuizGenerator content={[TEST_CONCEPT_TO_USE_FOR_KANA_VOCAB]} />)
      expect(await screen.findByText('Enter' + testConceptToUseForKanaVocabQuestion.questionPrompt)).toBeInTheDocument()
      expect(screen.queryByTestId('kana-vocab-question-container')).toBeInTheDocument()
    })

    const answerQuestionsAndSubmit = (): void => {
      const inputElement = screen.getByPlaceholderText('Answer')
      fireEvent.change(inputElement, { target: { value: testConceptToUseForKanaVocabQuestion.answers[0].answer } })
      fireEvent.click(screen.getByText('Check'))
    }

    it(testNames.submitsData, () => {
      const mockSubmitQuestionDataFunc = jest.fn()
      renderWithProviders(
              <MockQuizGenerator
                  content={[TEST_CONCEPT_TO_USE_FOR_KANA_VOCAB]}
                  submitQuestionsData={mockSubmitQuestionDataFunc}
              />
      )
      answerQuestionsAndSubmit()
      expect(mockSubmitQuestionDataFunc).toHaveBeenCalled()
    })

    it(testNames.callsClosingFunc, () => {
      const mockOnQuizFinish = jest.fn()
      renderWithProviders(
              <MockQuizGenerator
                  content={[TEST_CONCEPT_TO_USE_FOR_KANA_VOCAB]}
                  onQuizFinish={mockOnQuizFinish}
              />
      )
      answerQuestionsAndSubmit()
      fireEvent.click(screen.getByText('Finish'))
      expect(mockOnQuizFinish).toHaveBeenCalled()
    })

    it(testNames.showsSrsLevelUp, () => {
      renderWithProviders(
                <MockQuizGenerator
                    content={[TEST_CONCEPT_TO_USE_FOR_KANA_VOCAB]}
                />
      )
      answerQuestionsAndSubmit()
      fireEvent.click(screen.getByText('Finish'))
      expect(screen.queryByText(srsCardLevelNames[(srsLevelToUse + 1) as keyof typeof srsCardLevelNames])).toBeInTheDocument()
    })

    it(testNames.showsSrsLevelDown, () => {
      renderWithProviders(
                  <MockQuizGenerator
                      content={[TEST_CONCEPT_TO_USE_FOR_KANA_VOCAB]}
                  />
      )
      const inputElement = screen.getByPlaceholderText('Answer')
      fireEvent.change(inputElement, { target: { value: 'wrong answer' } })
      fireEvent.click(screen.getByText('Check'))
      fireEvent.click(screen.getByText('Continue'))
      answerQuestionsAndSubmit()
      fireEvent.click(screen.getByText('Finish'))
      expect(screen.queryByText(srsCardLevelNames[(srsLevelToUse - 1) as keyof typeof srsCardLevelNames])).toBeInTheDocument()
    })
  })

  describe('Grammar question', () => {
    const testConceptToUseForGrammarQuestion = LessonTenContent[TEST_CONCEPT_TO_USE_FOR_GRAMMAR].Questions as GrammarQuestionType[]
    it('Properly renders', async () => {
      renderWithProviders(<MockQuizGenerator content={[TEST_CONCEPT_TO_USE_FOR_GRAMMAR]}/>)
      expect(await screen.findByText(testConceptToUseForGrammarQuestion[0].questionPrompt)).toBeInTheDocument()
      expect(screen.queryByTestId('grammar-question-container')).toBeInTheDocument()
    })

    const answerQuestionsAndSubmit = async (): Promise<void> => {
      let inputElements = await screen.findAllByPlaceholderText('')
      for (let i = 0; i < inputElements.length; ++i) {
        await user.keyboard(testConceptToUseForGrammarQuestion[0].answer[i])
      }
      fireEvent.click(screen.getByText('Check'))
      fireEvent.click(screen.getByText('Continue'))
      inputElements = await screen.findAllByPlaceholderText('')
      for (let i = 0; i < inputElements.length; ++i) {
        await user.keyboard(testConceptToUseForGrammarQuestion[1].answer[i])
      }
      fireEvent.click(screen.getByText('Check'))
    }

    it(testNames.submitsData, async () => {
      const mockSubmitQuestionDataFunc = jest.fn()
      renderWithProviders(
        <MockQuizGenerator
            content={[TEST_CONCEPT_TO_USE_FOR_GRAMMAR]}
            submitQuestionsData={mockSubmitQuestionDataFunc}
        />
      )
      await answerQuestionsAndSubmit()
      expect(mockSubmitQuestionDataFunc).toHaveBeenCalled()
    })

    it(testNames.callsClosingFunc, async () => {
      const mockOnQuizFinish = jest.fn()
      renderWithProviders(
          <MockQuizGenerator
              content={[TEST_CONCEPT_TO_USE_FOR_GRAMMAR]}
              onQuizFinish={mockOnQuizFinish}
          />
      )
      await answerQuestionsAndSubmit()
      fireEvent.click(screen.getByText('Finish'))
      expect(mockOnQuizFinish).toHaveBeenCalled()
    })

    it(testNames.showsSrsLevelUp, async () => {
      renderWithProviders(
            <MockQuizGenerator
                content={[TEST_CONCEPT_TO_USE_FOR_GRAMMAR]}
            />
      )
      await answerQuestionsAndSubmit()
      expect(screen.queryByText(srsCardLevelNames[(srsLevelToUse + 1) as keyof typeof srsCardLevelNames])).toBeInTheDocument()
    })
  })
})
