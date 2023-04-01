import { LinkButton } from "../LinkButton";
import { screen, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const TEST_TITLE = 'title'
const TEST_LINK = '/link'

describe("LinkButton", () => {
    it("renders with proper link and title", () => {
        render(
            <BrowserRouter>
                <LinkButton 
                    title={TEST_TITLE}
                    link={TEST_LINK}
                    color='white'
                />
            </BrowserRouter>
        )

        const linkElement = screen.getByRole('link')
        expect(linkElement).toHaveAttribute("href", TEST_LINK)
        expect(linkElement).toHaveTextContent(TEST_TITLE)
    })
})