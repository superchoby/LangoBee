import { NotFoundPage } from "./404NotFound";
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from 'react-router-dom'

describe("Not Found Page Tests", () => {
    it("Renders properly", () => {
        const couldntFindMsg = "Sorry we couldn't find the page you are looking for 😔"
        render(
            <BrowserRouter>
                <NotFoundPage />
            </BrowserRouter>
        )
        // @ts-ignore
        expect(screen.getByText(couldntFindMsg)).toBeInTheDocument()
    })
})