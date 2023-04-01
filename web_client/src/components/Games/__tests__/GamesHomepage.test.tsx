import { GamesHomepage } from '../homepage'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../__mocks__/Provider'
import { BrowserRouter } from 'react-router-dom'

const MockGamesHomepage = () => (
    <BrowserRouter>
        <GamesHomepage />
    </BrowserRouter>
)

describe("Games Tests", () => {
    it("Games homepage renders", () => {
        renderWithProviders(<MockGamesHomepage />)
        const header = screen.getByText("Games")
        expect(header).toBeInTheDocument()
    })
})