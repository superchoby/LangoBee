import { AuthenticationPageWrapper } from '../AuthenticationPageWrapper'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const TEST_TITLE = 'test title'
const TEST_MESSAGE = 'test message'
const TEST_BUTTON_TEXT = 'test button text'
const TEST_FORM_NAME = 'test form name'
const TEST_AUTHENTICATION_PROCESS_ERROR_MESSAGE = 'test error message'
const TEST_ALTERNATIVE_LINK = 'test alternative link'
const TEST_PLACEHOLDER = 'test placeholder'


const MockAuthenticationPageWrapper = ({
    onSubmit=() => {},
    authenticationInfoIsBeingSent=false,
    infoHasBeenSubmitted=false,
    contentToShowAfterSubmit=<></>,
}: {
    onSubmit?(): void
    authenticationInfoIsBeingSent?: boolean
    infoHasBeenSubmitted?: boolean
    contentToShowAfterSubmit?: JSX.Element
}) => {
  return (
        <BrowserRouter>
            <AuthenticationPageWrapper
                title={TEST_TITLE}
                message={TEST_MESSAGE}
                buttonText={TEST_BUTTON_TEXT}
                onSubmit={onSubmit}
                alternativeLinks={<>{TEST_ALTERNATIVE_LINK}</>}
                inputs={[<input key='test key' placeholder={TEST_PLACEHOLDER} />]}
                formName={TEST_FORM_NAME}
                authenticationInfoIsBeingSent={authenticationInfoIsBeingSent}
                authenticationProcessErrorMessage={TEST_AUTHENTICATION_PROCESS_ERROR_MESSAGE}
                infoHasBeenSubmitted={infoHasBeenSubmitted}
                contentToShowAfterSubmit={contentToShowAfterSubmit}
            />
        </BrowserRouter>
  )
}

describe('Forgot Password Tests', () => {
  it('Header and forgot password message and form renders', () => {
    render(<MockAuthenticationPageWrapper />)
    expect(screen.queryByRole('heading', { name: TEST_TITLE }))
    expect(screen.queryByRole('paragraph', { name: TEST_MESSAGE }))
    expect(screen.queryByRole('form')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: TEST_BUTTON_TEXT })).toBeInTheDocument()
    expect(screen.queryByText(TEST_ALTERNATIVE_LINK)).toBeInTheDocument()
  })

  describe('On submit triggers', () => {
    
    it('on button click', () => {
        const mockOnSubmit = jest.fn()
        render (<MockAuthenticationPageWrapper onSubmit={mockOnSubmit} />)
        const submitButton = screen.getByRole('button', { name: TEST_BUTTON_TEXT })
        fireEvent.click(submitButton)
        expect(mockOnSubmit).toHaveBeenCalled()
    })

    it('on input submit', () => {
        const mockOnSubmit = jest.fn()
        render (<MockAuthenticationPageWrapper onSubmit={mockOnSubmit} />)
        const input = screen.getByPlaceholderText(TEST_PLACEHOLDER)
        fireEvent.submit(input)
        expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  it('form appears at first but is gone after submitting info', () => {
    const { rerender } = render(<MockAuthenticationPageWrapper infoHasBeenSubmitted={false} />)
    expect(screen.queryByLabelText(TEST_FORM_NAME)).toBeInTheDocument()
    rerender(<MockAuthenticationPageWrapper infoHasBeenSubmitted={true} />)
    expect(screen.queryByLabelText(TEST_FORM_NAME)).not.toBeInTheDocument()
  })

  it('Button text is gone while info is being submitted', () => {
    render(<MockAuthenticationPageWrapper authenticationInfoIsBeingSent={true} />)
    expect(screen.queryByLabelText(TEST_BUTTON_TEXT)).not.toBeInTheDocument()
  })

  it('Content shown after submit', () => {
    render(<MockAuthenticationPageWrapper infoHasBeenSubmitted={true} contentToShowAfterSubmit={<div>TEST CONTENT</div>}/>)
    expect(screen.queryByText('TEST CONTENT')).toBeInTheDocument()
  })
})
