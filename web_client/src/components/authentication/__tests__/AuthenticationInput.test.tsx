import { AuthenticationInput } from "../AuthenticationInput";
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'

const MockAuthenticationInput = ({testLabel}: {testLabel: string}) => {
    const [value, changeValue] = useState('')
    return (
        <AuthenticationInput 
            id='test-input'
            label={testLabel}
            placeholder='test placeholder'
            type='text'
            value={value}
            changeValue={changeValue} 
        />
    )
}

describe("Authentication Input Tests", () => {
    const testLabel = 'Test Label'
    it("Renders properly", () => {
        render(
            <AuthenticationInput 
                id='test-input'
                label={testLabel}
                placeholder='test placeholder'
                type='text'
                value={''}
                changeValue={() => {}} 
            />
        )
    
        const inputEl = screen.getByLabelText(testLabel)
        expect(inputEl).toBeInTheDocument();
        expect(inputEl).toHaveAttribute("type", "text")
    })

    it("Should be able to type in input", () => {
        render(<MockAuthenticationInput testLabel={testLabel} />)
        
        const testValue = "test value"
        const inputEl = screen.getByLabelText(testLabel)
        fireEvent.change(inputEl, { target: { value: testValue}})

        expect(inputEl).toHaveValue(testValue);
    })
    
})