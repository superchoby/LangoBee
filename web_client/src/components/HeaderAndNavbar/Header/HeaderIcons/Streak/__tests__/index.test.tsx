import { StreakIcon } from '..'
import {
  practiceJapaneseTodayMsg,
  youAreCurrentlyOnAXDayStreak
} from '../StreakCalendar'
import { screen, fireEvent } from '@testing-library/react'
import {
  renderWithProviders,
  mockReduxState
} from 'src/__mocks__/Provider'

function getXDatesFromToday (numberOfDates: number): Array<{
  expGained: number
  date: Date
}> {
  const currentDate = new Date()
  const dateArray = []
  for (let i = 0; i < numberOfDates; ++i) {
    dateArray.push({
      expGained: 0,
      date: new Date(currentDate)
    })
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return dateArray
}

describe('StreakIcon', () => {
  it('Streak icon shows', () => {
    renderWithProviders(<StreakIcon />)
    expect(screen.queryByAltText('streak-icon')).toBeInTheDocument()
  })

  it("Calendar renders with a start streak msg when they haven't studied today or yesterday", () => {
    renderWithProviders(<StreakIcon />)
    fireEvent.mouseOver(screen.getByTestId('header-icon-wrapper'))
    expect(screen.queryByText(practiceJapaneseTodayMsg(false))).toBeInTheDocument()
  })

  it("Calendar renders with a continue streak msg when they haven't studied today but have studied yesterday", () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    renderWithProviders(<StreakIcon />, {
      preloadedState: mockReduxState({
        user: {
          datesStudied: [
            {
              expGained: 0,
              date: yesterday
            }
          ]
        }
      })
    })
    fireEvent.mouseOver(screen.getByTestId('header-icon-wrapper'))
    expect(screen.queryByText(practiceJapaneseTodayMsg(true))).toBeInTheDocument()
  })

  it('Calendar tells the user how long they have been on a streak for', () => {
    renderWithProviders(<StreakIcon />,
      {
        preloadedState: mockReduxState({
          user: {
            datesStudied: getXDatesFromToday(16)
          }
        })
      }
    )
    fireEvent.mouseOver(screen.getByTestId('header-icon-wrapper'))
    expect(screen.queryByText(youAreCurrentlyOnAXDayStreak(16))).toBeInTheDocument()
  })
})
