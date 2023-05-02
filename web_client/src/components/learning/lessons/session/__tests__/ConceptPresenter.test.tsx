import { SubjectPresenter } from '../SubjectPresenter'
import { screen } from '@testing-library/react'
import { renderWithProviders } from 'src/__mocks__/Provider'

const MockSubjectPresenter = ({
  hideExplanation
}: { hideExplanation: boolean }) => {
  return (
        <SubjectPresenter
            card={{
              concept: 'test concept',
              explanationHeader: 'Corresponding Hiragana',
              explanation: 'test explanation',
              extraInfoList: [],
              pronunciationFile: 'testfile.mp4'
            }}
            hideExplanation={hideExplanation}
            conceptType="Vocabulary"
        />
  )
}

describe('Concept Presenter Tests', () => {
  it('Renders Properly and shows Explanations', () => {
    renderWithProviders(<MockSubjectPresenter hideExplanation={false} />)
    const conceptDisplayElement = screen.getByText('test concept')
    const explanationHeaderElement = screen.getByText('Corresponding Hiragana:')
    const explanationElement = screen.getByText('test explanation')
    expect(screen.getByLabelText('Concept Presenter')).toBeInTheDocument()
    expect(conceptDisplayElement).toBeInTheDocument()
    expect(explanationHeaderElement).toBeInTheDocument()
    expect(explanationElement).toBeInTheDocument()
  })

  it('Renders Properly and hides Explanations', () => {
    renderWithProviders(<MockSubjectPresenter hideExplanation={true} />)
    const conceptDisplayElement = screen.getByText('test concept')
    const explanationHeaderElement = screen.queryByText('Corresponding Hiragana:')
    const explanationElement = screen.queryByText('test explanation')
    expect(conceptDisplayElement).toBeInTheDocument()
    expect(explanationHeaderElement).not.toBeInTheDocument()
    expect(explanationElement).not.toBeInTheDocument()
  })
})
