import { FormContainer } from "../FormContainer";
import { render, screen } from '@testing-library/react'

describe("Form Container Tests", () => {
    it("Renders properly", () => {
        const testName = 'test name'
        render(
        <FormContainer name={testName} containerClass="login-form-container">
            <></>
        </FormContainer>
        )
        const formElement = screen.getByRole('form', { name: testName })
        expect(formElement).toBeInTheDocument()
    })
})