import { Login } from '../login'
import { screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { renderWithProviders } from '../../../__mocks__/Provider'
import { RouterWithLinks } from '../../../__mocks__/RouterWithLinks'
import { HOME_PATH } from 'src/paths'

describe('Login Tests', () => {
  it('Renders properly', () => {
    renderWithProviders(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
    )
    const header = screen.getByText('Log in')
    expect(header).toBeInTheDocument()
  })

  it('Redirects to dashboard after successful login', async () => {
    const dashboardDummyText = 'Dashboard Dummy'
    renderWithProviders(
            <RouterWithLinks
                mainComponent={<Login />}
                otherLinks={[{
                  path: HOME_PATH,
                  component: <div>{dashboardDummyText}</div>
                }]}
            />
    )

    const emailInputElement = screen.getByLabelText('Username or Email')
    const passwordInputElement = screen.getByLabelText('Password')
    fireEvent.change(emailInputElement, { target: { value: 'valid@email.com' } })
    fireEvent.change(passwordInputElement, { target: { value: 'validPassword' } })
    const buttonElement = screen.getByText('LOG IN')
    fireEvent.click(buttonElement)
    expect(await screen.findByText(dashboardDummyText)).toBeInTheDocument()
  })

  it("Shows account can't be found msg when sending invalid credentials", async () => {
    renderWithProviders(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
    )
    const emailInputElement = screen.getByLabelText('Username or Email')
    const passwordInputElement = screen.getByLabelText('Password')
    fireEvent.change(emailInputElement, { target: { value: 'invalid@email.com' } })
    fireEvent.change(passwordInputElement, { target: { value: 'invalidPassword' } })
    const buttonElement = screen.getByText('LOG IN')
    fireEvent.click(buttonElement)
    const accountNotFoundMsg = 'An account with the given username and/or password could not be found'
    expect(await screen.findByText(accountNotFoundMsg)).toBeInTheDocument()
  })
})
