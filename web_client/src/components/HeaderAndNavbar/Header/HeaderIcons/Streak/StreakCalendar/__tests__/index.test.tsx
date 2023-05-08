import {
  practiceJapaneseTodayMsg,
  congratsOnStudyingForAWholeSpecialPeriodStraight,
  youAreCurrentlyOnAXDayStreak,
  StreakCalendar
} from '../'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../__mocks__/Provider'

describe('StreakCalendar', () => {
  describe("When the user hasn't studied today", () => {
    it('Tells the user to start their streak', () => {
      renderWithProviders(
                <StreakCalendar
                    streakLength={0}
                    hasStudiedToday={false}
                    theLastTimeTheUserStudiedWasYesterday={false}
                />
      )

      expect(screen.queryByText(practiceJapaneseTodayMsg(false))).toBeInTheDocument()
    })

    it('Tells the user to continue their streak', () => {
      renderWithProviders(
                <StreakCalendar
                    streakLength={0}
                    hasStudiedToday={false}
                    theLastTimeTheUserStudiedWasYesterday={true}
                />
      )

      expect(screen.queryByText(practiceJapaneseTodayMsg(true))).toBeInTheDocument()
    })
  })

  describe('When the user has been studying for a week, month, or year', () => {
    it('Tells the user to they have been studying for a week', () => {
      renderWithProviders(
                <StreakCalendar
                    streakLength={7}
                    hasStudiedToday={true}
                    theLastTimeTheUserStudiedWasYesterday={false}
                />
      )

      expect(screen.queryByText(congratsOnStudyingForAWholeSpecialPeriodStraight('week'))).toBeInTheDocument()
    })

    it('Tells the user to they have been studying for a month', () => {
      renderWithProviders(
                <StreakCalendar
                    streakLength={30}
                    hasStudiedToday={true}
                    theLastTimeTheUserStudiedWasYesterday={false}
                />
      )

      expect(screen.queryByText(congratsOnStudyingForAWholeSpecialPeriodStraight('month'))).toBeInTheDocument()
    })
    it('Tells the user to they have been studying for a year', () => {
      renderWithProviders(
                <StreakCalendar
                    streakLength={365}
                    hasStudiedToday={true}
                    theLastTimeTheUserStudiedWasYesterday={false}
                />
      )

      expect(screen.queryByText(congratsOnStudyingForAWholeSpecialPeriodStraight('year'))).toBeInTheDocument()
    })
  })

  it('Tells the user how long their streak is', () => {
    renderWithProviders(
            <StreakCalendar
                streakLength={289}
                hasStudiedToday={true}
                theLastTimeTheUserStudiedWasYesterday={false}
            />
    )

    expect(screen.queryByText(youAreCurrentlyOnAXDayStreak(289))).toBeInTheDocument()
  })
})
