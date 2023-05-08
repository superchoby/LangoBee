import { CurrentLevel } from '../CurrentLevel'
import { screen } from '@testing-library/react'
import {
  renderWithProviders,
  mockReduxState
} from 'src/__mocks__/Provider'
import { getLevelInfo } from 'src/app/userSlice'

const TEST_USERNAME = 'test username'

const MockCurrentLevel = () => {
  return <CurrentLevel username={TEST_USERNAME} />
}

describe('CurrentLevel homepage component', () => {
  it('Tells the user about the current situation with their level', () => {
    const experiencePoints = 15679
    renderWithProviders(
            <MockCurrentLevel />,
            {
              preloadedState: mockReduxState({
                user: {
                  experiencePoints
                }
              })
            }
    )
    const {
      currentLevel,
      expUntilNextLevel
    } = getLevelInfo(experiencePoints)
    expect(screen.queryByText(`${expUntilNextLevel} XP until Lv ${currentLevel + 1}`)).toBeInTheDocument()
    expect(screen.queryByText(TEST_USERNAME)).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).toBeInTheDocument()
  })
})
