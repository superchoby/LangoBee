import {
  Streak,
  STREAK_ICON_ALT
} from '../'
import { render, screen } from '@testing-library/react'

describe('Streak tests', () => {
  it('Renders the proper streak length and the icon', () => {
    const STREAK_LENGTH = 89
    render(<Streak streakLength={STREAK_LENGTH} />)
    expect(screen.queryByAltText(STREAK_ICON_ALT)).toBeInTheDocument()
    expect(screen.queryByText(STREAK_LENGTH.toString())).toBeInTheDocument()
  })
})
