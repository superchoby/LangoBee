import { Login } from '../login'
import { screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { renderWithProviders } from '../../../__mocks__/Provider'
import { RouterWithLinks } from '../../../__mocks__/RouterWithLinks'
import { HOME_PATH } from 'src/paths'

describe('Login Tests', () => {
  it('header and inputs render', () => {
    renderWithProviders(
      <BrowserRouter>
          <Login />
      </BrowserRouter>
    )
    const header = screen.getByRole('heading', { name: 'LOGIN' })
    expect(header).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Username or email')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Password')).toBeInTheDocument()
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
        <Login />
      </RouterWithLinks>
    )

    const emailInputElement = screen.getByPlaceholderText('Username or email')
    const passwordInputElement = screen.getByPlaceholderText('Password')
    fireEvent.change(emailInputElement, { target: { value: 'valid@email.com' } })
    fireEvent.change(passwordInputElement, { target: { value: 'validPassword' } })
    const buttonElement = screen.getByRole('button', { name: 'LOGIN' })
    fireEvent.click(buttonElement)
    expect(await screen.findByText(dashboardDummyText)).toBeInTheDocument()
  })

  it("Shows account can't be found msg when sending invalid credentials", async () => {
    renderWithProviders(
      <BrowserRouter>
          <Login />
      </BrowserRouter>
    )
    const emailInputElement = screen.getByPlaceholderText('Username or email')
    const passwordInputElement = screen.getByPlaceholderText('Password')
    fireEvent.change(emailInputElement, { target: { value: 'invalid@email.com' } })
    fireEvent.change(passwordInputElement, { target: { value: 'invalidPassword' } })
    const buttonElement = screen.getByRole('button', { name: 'LOGIN' })
    fireEvent.click(buttonElement)
    const accountNotFoundMsg = 'An account with the given username and/or password could not be found'
    expect(await screen.findByText(accountNotFoundMsg)).toBeInTheDocument()
  })
})
