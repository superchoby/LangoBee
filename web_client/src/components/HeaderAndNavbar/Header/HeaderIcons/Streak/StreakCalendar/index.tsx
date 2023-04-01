import Calendar from './Calendar'
import './index.scss'
import { useMemo } from 'react'

interface StreakCalendarProps {
  streakLength: number
  hasStudiedToday: boolean
  theLastTimeTheUserStudiedWasYesterday: boolean
}

export const practiceJapaneseTodayMsg = (theLastTimeTheUserStudiedWasYesterday: boolean): string => {
  return `Practice some Japanese today to ${theLastTimeTheUserStudiedWasYesterday ? 'continue' : 'start'} your streak!`
}

export const congratsOnStudyingForAWholeSpecialPeriodStraight = (periodOfTime: string): string => {
  return `Congratulations on studying Japanese for a whole ${periodOfTime} straight!`
}

export const youAreCurrentlyOnAXDayStreak = (streakLength: number): string => {
  return `Woohoo, you are currently on a ${streakLength} day streak!`
}

export const StreakCalendar = ({
  streakLength,
  hasStudiedToday,
  theLastTimeTheUserStudiedWasYesterday
}: StreakCalendarProps): JSX.Element => {
  const streakMsg = useMemo(() => {
    if (!hasStudiedToday) {
      return practiceJapaneseTodayMsg(theLastTimeTheUserStudiedWasYesterday)
    }

    // If user has student for exactly a week, month, or year, this variable will have a non blank value
    let specialDurationStudentHasStudiedOrBlank = ''
    if (streakLength === 7) {
      specialDurationStudentHasStudiedOrBlank = 'week'
    } else if (streakLength === 30) {
      specialDurationStudentHasStudiedOrBlank = 'month'
    } else if (streakLength === 365) {
      specialDurationStudentHasStudiedOrBlank = 'year'
    }

    return specialDurationStudentHasStudiedOrBlank === ''
      ? youAreCurrentlyOnAXDayStreak(streakLength)
      : congratsOnStudyingForAWholeSpecialPeriodStraight(specialDurationStudentHasStudiedOrBlank)
  }, [streakLength, hasStudiedToday, theLastTimeTheUserStudiedWasYesterday])

  return (
        <div className='streak-calendar-container'>
            <div>
                <h2>Streak</h2>
                <div className='streak-message'>
                    {streakMsg}
                </div>
            </div>

            <Calendar
                showNeighboringMonth={false}
            />
        </div>
  )
}
