import { Signup } from '../signup'
import { screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { renderWithProviders } from '../../../__mocks__/Provider'
import { RouterWithLinks } from '../../../__mocks__/RouterWithLinks'
import { HOME_PATH } from 'src/paths'

const MockSignup = () => {
  return (
        <BrowserRouter>
            <Signup />
        </BrowserRouter>
  )
}

describe('Signup Tests', () => {
  it('header and inputs rendery', () => {
    renderWithProviders(<MockSignup />)
    expect(screen.queryByRole('heading', { name: 'SIGN UP' })).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Reenter Password')).toBeInTheDocument()
  })

  it('Redirects to dashboard after successful login', async () => {
    const dashboardDummyText = 'Dashboard Dummy'
    renderWithProviders(
            <RouterWithLinks
                otherLinks={[{
                  path: HOME_PATH,
                  component: <div>{dashboardDummyText}</div>
                }]}
            >
              <Signup />
            </RouterWithLinks>
    )

    const usernameInputElement = screen.getByPlaceholderText('Username')
    const emailInputElement = screen.getByPlaceholderText('Email')
    const passwordInputElement = screen.getByPlaceholderText('Password')
    const confirmPasswordInputElement = screen.getByPlaceholderText('Reenter Password')
    fireEvent.change(usernameInputElement, { target: { value: 'valid username' } })
    fireEvent.change(emailInputElement, { target: { value: 'valid@email.com' } })
    fireEvent.change(passwordInputElement, { target: { value: 'valid password' } })
    fireEvent.change(confirmPasswordInputElement, { target: { value: 'valid password' } })
    const buttonElement = screen.getByRole('button', { name: 'SIGN UP' })
    fireEvent.click(buttonElement)
    expect(await screen.findByText(dashboardDummyText)).toBeInTheDocument()
  })

  it('Shows error messages for fields with invalid inputs', async () => {
    renderWithProviders(<MockSignup />)
    const emailInputElement = screen.getByPlaceholderText('Email')
    const confirmPasswordInputElement = screen.getByPlaceholderText('Reenter Password')
    fireEvent.change(emailInputElement, { target: { value: 'invalid' } })
    fireEvent.change(confirmPasswordInputElement, { target: { value: 'non matching password' } })
    const buttonElement = screen.getByRole('button', { name: 'SIGN UP' })
    fireEvent.click(buttonElement)
    expect(screen.getByText('The username you entered was invalid')).toBeInTheDocument()
    expect(screen.getByText('The email you entered was invalid')).toBeInTheDocument()
    expect(screen.getByText('The password you entered was invalid')).toBeInTheDocument()
    expect(screen.getByText('The passwords do not match')).toBeInTheDocument()
  })
})
