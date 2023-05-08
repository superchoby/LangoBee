import { SubmitButton } from '../SubmitButton'
import { render, screen } from '@testing-library/react'

describe('Authentication Submit Button Component Tests', () => {
  it('Renders properly', () => {
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
})
