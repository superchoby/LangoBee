import { Header } from "../header";
import { render, screen } from "@testing-library/react"

describe("Authentication Header Component Tests", () => {
    it("Renders properly", () => {
        const exampleHeaderText = 'Example Text'
        render(<Header headerText={exampleHeaderText} />)
        expect(screen.getByText(exampleHeaderText)).toBeInTheDocument()
    })
})