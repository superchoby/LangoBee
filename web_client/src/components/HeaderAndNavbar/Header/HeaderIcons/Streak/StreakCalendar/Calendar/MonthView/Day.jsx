import { getDayStart, getDayEnd } from '@wojtekmaj/date-utils'
import fireIcon from './fire-dark.png'
import Tile from '../Tile'
import './Day.scss'
import PropTypes from 'prop-types'
import { isWeekend } from '../shared/dates'
import {
  formatDay as defaultFormatDay,
  formatLongDate as defaultFormatLongDate
} from '../shared/dateFormatter'
import { tileProps } from '../shared/propTypes'

const className = 'react-calendar__month-view__days__day'

const DayNumberComponent = ({
  thisDateIsToday,
  thisIsAStreakDay,
  formatDay,
  locale,
  date,
  datesStudiedObj
}) => {
  if (thisDateIsToday && thisIsAStreakDay) {
    return (
      <div className='center-streak-indicator-circle'>
        <img className='streak-fire-icon' src={fireIcon} alt="fire"/>
        <span
          className={'calendar-day-number today-indicator today-streak-indicator'}
        >{formatDay(locale, date)}</span>
      </div>
    )
  } else if (thisDateIsToday) {
    return (
      <div>
        <span
          className={'calendar-day-number today-indicator'}
        >{formatDay(locale, date)}</span>
      </div>
    )
  } else if (thisIsAStreakDay) {
    const copyDate = new Date(date)
    copyDate.setDate(copyDate.getDate() - 1)
    const isFirstDayOfStreak = !Object.keys(datesStudiedObj).includes(copyDate.toString())
    copyDate.setDate(copyDate.getDate() + 2)
    const isLastDayOfStreak = !Object.keys(datesStudiedObj).includes(copyDate.toString())
    const streakOnlyDay = isFirstDayOfStreak && isLastDayOfStreak
    const getStreakClassName = () => {
      if (streakOnlyDay) {
        return 'lone-streak-day'
      } else if (isFirstDayOfStreak) {
        return 'beginning-of-streak'
      } else if (isLastDayOfStreak) {
        return 'end-of-streak'
      }
    }

    return (
      <div className='center-streak-indicator-circle'>
        <span
          className={`calendar-day-number streak-day ${getStreakClassName()}`}
        >{formatDay(locale, date)}</span>
      </div>
    )
  }

  return (
    <div>
      <span
        className='calendar-day-number'
      >{formatDay(locale, date)}</span>
    </div>
  )
}

DayNumberComponent.propTypes = {
  thisDateIsToday: PropTypes.bool,
  thisIsAStreakDay: PropTypes.bool,
  formatDay: PropTypes.func,
  locale: PropTypes.string,
  // eslint-disable-next-line react/no-typos
  date: PropTypes.instanceOf(Date),
  datesStudiedObj: PropTypes.object
}

export default function Day ({
  formatDay = defaultFormatDay,
  formatLongDate = defaultFormatLongDate,
  calendarType,
  classes,
  currentMonthIndex,
  datesStudiedObj,
  ...otherProps
}) {
  const { date, locale } = otherProps
  // console.log(date.toString())
  // console.log(Object.keys(datesStudiedObj).includes(date.toString()))
  // const currentDateSimplified = datesStudiedObj.
  const thisIsAStreakDay = Object.keys(datesStudiedObj).includes(date.toString())
  const today = new Date()
  const thisDateIsToday = date.getDate() === today.getDate() && date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()
  return (
    <Tile
      {...otherProps}
      classes={[].concat(
        classes,
        className,
        isWeekend(date, calendarType) ? `${className}--weekend` : null,
        date.getMonth() !== currentMonthIndex ? `${className}--neighboringMonth` : null
      )}
      formatAbbr={formatLongDate}
      maxDateTransform={getDayEnd}
      minDateTransform={getDayStart}
      view="month"
    >
      <DayNumberComponent
        thisDateIsToday={thisDateIsToday}
        thisIsAStreakDay={thisIsAStreakDay}
        formatDay={formatDay}
        locale={locale}
        date={date}
        datesStudiedObj={datesStudiedObj}
      />
      {/* {

        // <div className={thisDateIsToday ? 'today-indicator' : ''}>
        <div className={thisDateIsToday ? 'center-today-indicator-circle' : ''}>
          {thisDateIsToday && thisIsAStreakDay && <img className='streak-day' src={fireIcon} alt="fire"/>}
          <span
           className={`calendar-day-number ${thisDateIsToday ? 'today-indicator' : ''}`}
          >{formatDay(locale, date)}</span>
        </div>
      } */}
    </Tile>
  )
}

Day.propTypes = {
  ...tileProps,
  currentMonthIndex: PropTypes.number.isRequired,
  formatDay: PropTypes.func,
  formatLongDate: PropTypes.func
}
