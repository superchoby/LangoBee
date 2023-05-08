import { BackButton } from '../BackButton'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HOME_PATH } from 'src/paths'

describe('BackButton', () => {
  it('Renders link with "Home" message', () => {
    render(
            <BrowserRouter>
                <BackButton />
            </BrowserRouter>
    )
    expect(screen.queryByText('Home')).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeInTheDocument()
    const linkEl = screen.getByRole('link')
    expect(linkEl).toHaveAttribute('href', HOME_PATH)
  })
})
