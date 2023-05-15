import { SubmitButton } from '../SubmitButton'
import { render, screen, fireEvent } from '@testing-library/react'

describe('Authentication Submit Button Component Tests', () => {
  it('button renders', () => {
    const submitButtonText = 'submit button text'
    render(
            <SubmitButton
                text={submitButtonText}
                onClick={() => {}}
                dataHasFinishedProcessing={true}
            />
    )
    expect(screen.getByText(submitButtonText)).toBeInTheDocument()
  })

  it('Onclick is called', () => {
    const submitButtonText = 'submit button text'
    const onClick = jest.fn()
    render(
            <SubmitButton
                text={submitButtonText}
                onClick={onClick}
                dataHasFinishedProcessing={true}
            />
    )
    fireEvent.click(screen.getByText(submitButtonText))
    expect(onClick).toHaveBeenCalled()
  })
})
