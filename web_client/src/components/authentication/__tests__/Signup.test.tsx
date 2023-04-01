import { Signup } from "../signup";
import { screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { renderWithProviders } from '../../../__mocks__/Provider'
import { RouterWithLinks } from '../../../__mocks__/RouterWithLinks'
import { HOME_PATH } from "src/paths";

const MockSignup = () => {
    return (
        <BrowserRouter>
            <Signup />
        </BrowserRouter>
    )
}

describe("Signup Tests", () => {
    it("Renders properly", () => {
        renderWithProviders(<MockSignup />)
        const header = screen.getByText('Sign up')
        expect(header).toBeInTheDocument()
    })

    it("Redirects to dashboard after successful login", async () => {
        const dashboardDummyText = 'Dashboard Dummy'
        renderWithProviders(
            <RouterWithLinks 
                mainComponent={<Signup />} 
                otherLinks={[{
                    path: HOME_PATH,
                    component: <div>{dashboardDummyText}</div>,
                }]}
            />
        )
        
        const usernameInputElement = screen.getByLabelText('Username')
        const emailInputElement = screen.getByLabelText('Email')
        const passwordInputElement = screen.getByLabelText('Password')
        const confirmPasswordInputElement = screen.getByLabelText('Confirm Password')
        fireEvent.change(usernameInputElement, { target: { value: "valid username"}})
        fireEvent.change(emailInputElement, { target: { value: "valid@email.com"}})
        fireEvent.change(passwordInputElement, { target: { value: "valid password"}})
        fireEvent.change(confirmPasswordInputElement, { target: {value: 'valid password'} })
        const buttonElement = screen.getByText('SIGN UP')
        fireEvent.click(buttonElement)
        expect(await screen.findByText(dashboardDummyText)).toBeInTheDocument()
    })

    it("Shows error messages for fields with invalid inputs", async () => {
        renderWithProviders(<MockSignup />)
        const emailInputElement = screen.getByLabelText('Email')
        const confirmPasswordInputElement = screen.getByLabelText('Confirm Password')
        fireEvent.change(emailInputElement, { target: { value: "invalid"}})
        fireEvent.change(confirmPasswordInputElement, { target: {value: 'non matching password'} })
        const buttonElement = screen.getByText('SIGN UP')
        fireEvent.click(buttonElement)
        expect(screen.getByText("The username you entered was invalid")).toBeInTheDocument()
        expect(screen.getByText("The email you entered was invalid")).toBeInTheDocument()
        expect(screen.getByText("The password you entered was invalid")).toBeInTheDocument()
        expect(screen.getByText("The passwords do not match")).toBeInTheDocument()
    })

})