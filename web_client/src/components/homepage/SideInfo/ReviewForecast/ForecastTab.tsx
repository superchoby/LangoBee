import { useState, useEffect } from 'react'
import {
  RxCaretDown,
  RxCaretUp
} from 'react-icons/rx'
import './ForecastTab.scss'
import { CardsForHour, CardsForHourProps } from './CardsForHour'

export interface ForecastTabProps {
  day: number
  cardTimesByHour: number[]
  isToday: boolean
  firstDayWithCards: boolean
  maxAmtOfCardsInAnHour: number
  cardTotalBeforeThisDay: number
}

const daysIndexToName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const UPWARDS_CARET_TESTID = 'upwards-caret'
export const DOWNWARDS_CARET_TESTID = 'downwards-caret'

/**
 * A tab that shows how many review cards a user will gain per hour for a given day
 * @param day - The day that this tab is showing info for
 * @param cardTimesByHour - A list showing how many cards a user will gain per hour
 * @param isToday - Whether or not this tab is showing info for today or not
 * @param firstDayWithCards - Whether or not this tab is showing info for the first
 * day of the week that has revieww cards for the user, if not, then this tab will be
 * closed by default
 * @param maxAmtOfCardsInAnHour - The max amt of cards gained in an hour for any given day,
 * this helps change the relative size of the bar that shows how many review cards are gained
 * in a specific hour
 * @param cardTotalBeforeThisDay - The amt of cards the user needs to review before the day
 * that the tab repressents info for
 * @returns
 */
export const ForecastTab = ({
  day,
  cardTimesByHour,
  isToday,
  firstDayWithCards,
  maxAmtOfCardsInAnHour,
  cardTotalBeforeThisDay
}: ForecastTabProps): JSX.Element => {
  const [showCardTimes, changeShowCardTimes] = useState(firstDayWithCards)
  const [cardsForHourObjList, changeCardsForHourObjList] = useState<CardsForHourProps[]>([])

  useEffect(() => {
    const objList: CardsForHourProps[] = []
    let hour = 0
    let cardsRunningTotal = cardTotalBeforeThisDay
    for (const numOfCards of cardTimesByHour) {
      if (numOfCards > 0) {
        cardsRunningTotal += numOfCards
        objList.push(
          {
            numOfCards,
            maxAmtOfCardsInAnHour,
            hour,
            cardsRunningTotal
          }
        )
      }
      hour += 1
    }
    changeCardsForHourObjList(objList)
  }, [cardTimesByHour, cardTotalBeforeThisDay, maxAmtOfCardsInAnHour])

  const sumOfAllCardsToday = cardTimesByHour.reduce((partialSum, a) => partialSum + a, 0)

  return (
        <div className={`forecast-tab-container ${showCardTimes ? 'forecast-tab-container-open' : ''}`} >
            <div
                className='day-name-and-card-count-container'
                style={{
                  cursor: `${sumOfAllCardsToday > 0 ? 'pointer' : 'auto'}`
                }}
                onClick={() => { if (sumOfAllCardsToday > 0) changeShowCardTimes(!showCardTimes) }}
            >
                <div className='forecast-arrow-icon-and-day-container'>
                    <div className={`current-day-name ${sumOfAllCardsToday > 0 ? 'day-with-reviews' : 'day-without-reviews'}`}>
                        {isToday ? 'Today' : daysIndexToName[day]}
                    </div>
                    <div className='cards-gained-and-view-more-caret-container'>
                      <span className='review-forecast-cards-gained-in-a-day'>
                          {`+${sumOfAllCardsToday}`}
                      </span>
                      {
                        showCardTimes
                          ? <RxCaretUp data-testid='upwards-caret' className='forecast-tab-view-caret day-without-reviews' />
                          : <RxCaretDown data-testid='downwards-caret' className='forecast-tab-view-caret' />
                      }

                    </div>
                </div>
                {/* <div
                    className='reviews-gained-and-total-container'
                    style={{ visibility: showCardTimes ? 'hidden' : 'visible' }}
                >
                     */}
                    {/* <div className='review-forecast-cards-total'>
                        {cardTotalBeforeThisDay + sumOfAllCardsToday}
                    </div> */}
                {/* </div> */}
            </div>

            <div className='card-for-hour-container' style={{ display: showCardTimes ? 'block' : 'none' }}>
                {
                    cardsForHourObjList.map((props: CardsForHourProps) =>
                        <CardsForHour key={props.hour} {...props} />
                    )
                }
            </div>
        </div>
  )
}
