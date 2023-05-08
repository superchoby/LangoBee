import { ResetPassword } from '../ResetPassword'
import { screen, fireEvent, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const MockResetPassword = () => {
  return (
        <BrowserRouter>
            <ResetPassword />
        </BrowserRouter>
  )
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    reset_token: 'valid token'
  })
}))
describe('Reset Password Page Tests', () => {
  it('Renders properly', () => {
    render(<MockResetPassword />)
    const container = screen.getByLabelText('change password page')
    expect(container).toBeInTheDocument()
  })

  it('Shows success message after password change', async () => {
    const successMsg = 'Successfully changed password!'
    render(<MockResetPassword />)

    const newPasswordInputElement = await screen.findByLabelText('New Password')
    const confirmPasswordInputElement = await screen.getByLabelText('Confirm New Password')
    fireEvent.change(newPasswordInputElement, { target: { value: 'valid password' } })
    fireEvent.change(confirmPasswordInputElement, { target: { value: 'valid password' } })
    const buttonElement = screen.getByText('CHANGE PASSWORD')
    fireEvent.click(buttonElement)
    expect(await screen.findByText(successMsg)).toBeInTheDocument()
  })

  it('Shows failure message after submitting invalid password', async () => {
    const invalidPasswordMsg = 'The password is invalid'
    render(<MockResetPassword />)

    const newPasswordInputElement = await screen.findByLabelText('New Password')
    const confirmPasswordInputElement = await screen.getByLabelText('Confirm New Password')
    fireEvent.change(newPasswordInputElement, { target: { value: 'invalid password' } })
    fireEvent.change(confirmPasswordInputElement, { target: { value: 'invalid password' } })
    const buttonElement = screen.getByText('CHANGE PASSWORD')
    fireEvent.click(buttonElement)
    expect(await screen.findByText(invalidPasswordMsg)).toBeInTheDocument()
  })
})
