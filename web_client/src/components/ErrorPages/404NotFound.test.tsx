import { NotFoundPage } from './404NotFound'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

describe('Not Found Page Tests', () => {
  it("message to user about not being able to find the page renders", () => {
    const couldntFindMsg = "Sorry we couldn't find the page you are looking for 😔"
    render(
            <BrowserRouter>
                <NotFoundPage />
            </BrowserRouter>
    )
    expect(screen.getByText(couldntFindMsg)).toBeInTheDocument()
  })
})
