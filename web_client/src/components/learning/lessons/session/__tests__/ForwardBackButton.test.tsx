import { ForwardBackButton } from '../ForwardBackButton'
import { fireEvent, render, screen } from '@testing-library/react'

describe("Forward Back Button Tests", () => {
    it("Properly Renders Visible Button", () => {
        render(
            <ForwardBackButton 
                onClick={() => {}}
                isForwardButton={false}
                display={true}
            />
        )
        const containerElement = screen.queryByLabelText('Back Button')
        expect(containerElement).toBeInTheDocument()
        expect(containerElement).toBeVisible()
    })

    it("Properly hides when it is not visible", () => {
        render(
            <ForwardBackButton 
                onClick={() => {}}
                isForwardButton={false}
                display={false}
            />
        )
        const containerElement = screen.queryByLabelText('Back Button')
        expect(containerElement).toBeInTheDocument()
        expect(containerElement).not.toBeVisible()
    })

    it("Calls function when clicked", () => {
        const mockOnClick = jest.fn()
        render(
            <ForwardBackButton 
                onClick={mockOnClick}
                isForwardButton={false}
                display={true}
            />
        )
        const containerElement = screen.getByLabelText('Back Button')
        fireEvent.click(containerElement)
        expect(mockOnClick).toBeCalledTimes(1)
    })
})