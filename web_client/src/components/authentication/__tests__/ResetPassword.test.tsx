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
    expect(screen.queryByRole('heading', { name: 'CHANGE PASSWORD' })).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('New Password')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Confirm New Password')).toBeInTheDocument()
  })

  it('Shows success message after password change', async () => {
    const successMsg = 'Successfully changed password!'
    render(<MockResetPassword />)

    const newPasswordInputElement = await screen.findByPlaceholderText('New Password')
    const confirmPasswordInputElement = await screen.getByPlaceholderText('Confirm New Password')
    fireEvent.change(newPasswordInputElement, { target: { value: 'valid password' } })
    fireEvent.change(confirmPasswordInputElement, { target: { value: 'valid password' } })
    const buttonElement = screen.getByRole('button', { name: 'CHANGE PASSWORD' })
    fireEvent.click(buttonElement)
    expect(await screen.findByText(successMsg)).toBeInTheDocument()
  })

  it('Shows failure message after submitting invalid password', async () => {
    const invalidPasswordMsg = 'The password is invalid'
    render(<MockResetPassword />)

    const newPasswordInputElement = await screen.findByPlaceholderText('New Password')
    const confirmPasswordInputElement = await screen.getByPlaceholderText('Confirm New Password')
    fireEvent.change(newPasswordInputElement, { target: { value: 'invalid password' } })
    fireEvent.change(confirmPasswordInputElement, { target: { value: 'invalid password' } })
    const buttonElement = screen.getByRole('button', { name: 'CHANGE PASSWORD' })
    fireEvent.click(buttonElement)
    expect(await screen.findByText(invalidPasswordMsg)).toBeInTheDocument()
  })
})
