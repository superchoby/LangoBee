import { HeaderIconWrapper } from '../HeaderIconWrapper'
import { Streak } from './Streak'
import { StreakCalendar } from './StreakCalendar'
import { useAppSelector } from 'src/app/hooks'
import { useMemo } from 'react'

const datesMatch = (dateOne: Date, dateTwo: Date): boolean => {
  const daysAreTheSame = dateOne.getDate() === dateTwo.getDate()
  const monthsAreTheSame = dateOne.getMonth() === dateTwo.getMonth()
  const yearsAreTheSame = dateOne.getFullYear() === dateTwo.getFullYear()

  return daysAreTheSame && monthsAreTheSame && yearsAreTheSame
}

export const StreakIcon = (): JSX.Element => {
  const { datesStudied } = useAppSelector(state => state.user)
  const streakLength = useMemo(() => {
    if (datesStudied.length === 0 || typeof datesStudied[0] === 'string') {
      return 0
    }

    let streakLength = 0
    const dateLookingFor = new Date()
    for (const { date } of datesStudied) {
      if (datesMatch(dateLookingFor, new Date(date))) {
        streakLength += 1
        dateLookingFor.setDate(dateLookingFor.getDate() - 1)
      } else {
        break
      }
    }
    return streakLength
  }, [datesStudied])

  return (
    <HeaderIconWrapper
        Icon={<Streak streakLength={streakLength} />}
        TooltipContents={
            <StreakCalendar
              streakLength={streakLength}
              hasStudiedToday={datesStudied.length > 0 && datesMatch(new Date(datesStudied[0].date), new Date())}
              theLastTimeTheUserStudiedWasYesterday={
                datesStudied.length > 0 &&
                  datesMatch(
                    new Date(datesStudied[0].date),
                    (() => {
                      const yesterday = new Date()
                      yesterday.setDate(yesterday.getDate() - 1)
                      return yesterday
                    })()
                  )
              }
            />
        }
        isTheRightMostIcon={false}
    />
  )
}
