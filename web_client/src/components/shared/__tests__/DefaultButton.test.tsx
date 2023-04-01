import { DefaultButton } from "../DefaultButton";
import { render, screen, fireEvent } from '@testing-library/react'

describe("DefaultButton", () => {
    it('Renders with text and the onclick function is properly called', () => {
        const TEST_TEXT = 'text'
        const mockFn = jest.fn()
        render(
            <DefaultButton 
            onClick={mockFn}
            text={TEST_TEXT}
            className=''
            size='small'
            color='blue'
            />
        )

        expect(screen.queryByText(TEST_TEXT)).toBeInTheDocument()
        fireEvent.click(screen.getByText(TEST_TEXT))
        expect(mockFn).toHaveBeenCalled()
    })
})