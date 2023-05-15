import { ForgotPassword, EMAIL_HAS_BEEN_SENT_MSG } from '../ForgotPassword'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { rest } from 'msw'
import { server } from '../../../__mocks__/server'

const MockForgotPassword = () => {
  return (
        <BrowserRouter>
            <ForgotPassword />
        </BrowserRouter>
  )
}

describe('Forgot Password Tests', () => {
  it('Renders properly', () => {
    render(<MockForgotPassword />)
    const forgotPasswordHeader = screen.getByRole('heading')
    expect(forgotPasswordHeader).toHaveTextContent('FORGOT PASSWORD')
    const buttonElement = screen.getByText('SEND EMAIL')
    expect(buttonElement).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
  })

  it('Shows success message after sending a valid email string', async () => {
    render(<MockForgotPassword />)
    const inputElement = screen.getByPlaceholderText('Email')
    fireEvent.change(inputElement, { target: { value: 'valid@email.com' } })
    const buttonElement = screen.getByText('SEND EMAIL')
    fireEvent.click(buttonElement)
    expect(await screen.findByText(EMAIL_HAS_BEEN_SENT_MSG)).toBeInTheDocument()
  })

  it("Shows error message after trying to send a value that isn't an email", async () => {
    render(<MockForgotPassword />)
    const inputElement = screen.getByPlaceholderText('Email')
    fireEvent.change(inputElement, { target: { value: 'invalid value' } })
    const buttonElement = screen.getByText('SEND EMAIL')
    fireEvent.click(buttonElement)
    expect(await screen.findByText('Please enter a valid email')).toBeInTheDocument()
  })

  it('Lets user know when there are currently technical issues going on after sending a valid email', async () => {
    server.use(
      rest.post('/api/password_reset/', async (req, res, ctx) => {
        return await res(ctx.status(400))
      })
    )
    render(<MockForgotPassword />)
    const inputElement = screen.getByPlaceholderText('Email')
    fireEvent.change(inputElement, { target: { value: 'valid@email.com' } })
    const buttonElement = screen.getByText('SEND EMAIL')
    fireEvent.click(buttonElement)
    const techinicalIssuesMsg = 'Sorry but we are currently facing technical issues, please try again later'
    expect(await screen.findByText(techinicalIssuesMsg)).toBeInTheDocument()
  })
})
