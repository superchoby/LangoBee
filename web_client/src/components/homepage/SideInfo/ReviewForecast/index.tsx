import { useState, useEffect } from 'react'
import { ForecastTab } from './ForecastTab'
import { useAppSelector } from 'src/app/hooks'
import './index.scss'

interface ReviewForecastObjectType {
  day: number
  cardTimesByHour: number[]
  isToday: boolean
  firstDayWithCards: boolean
  cardTotalBeforeThisDay: number
}

interface ReviewForecastProps {
  allSrsCards: Array<{
    nextReviewDate: string
  }>
}

export const ReviewForecast = ({
  allSrsCards
}: ReviewForecastProps): JSX.Element => {
  const [reviewsExist, changeReviewsExist] = useState(false)
  const [reviewForecastObjects, changeReviewForecastObjectsType] = useState<ReviewForecastObjectType[]>([])
  const [maxAmtOfCardsInAnHour, changeMaxAmtOfCardsInAnHour] = useState(10)
  const [explainChartMeaning, changeExplainChartMeaning] = useState(false)
  const [totalAmtOfCardsThisWeek, changeTotalAmtOfCardsThisWeek] = useState(0)

  const { srsCardsToReview } = useAppSelector(state => state.srsFlashcards)
  const amtOfSrsCardsToReviewNow = srsCardsToReview.length

  useEffect(() => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(0, 0, 0, 0)
    const srsCardDates = allSrsCards.map(({ nextReviewDate }) =>
      new Date(nextReviewDate)
      // @ts-expect-error
    ).sort((a, b) => a - b).filter(date => {
      return date > (new Date()) && date < nextWeek
    }).map(date => {
      date.setHours(date.getHours() + 1)
      return date
    })

    let runningTotalOfAmtOfCardsEachDay = amtOfSrsCardsToReviewNow

    if (srsCardDates.length === 0) {
      changeReviewsExist(false)
      return
    } else {
      changeReviewsExist(true)
    }

    const newReviewsForecastObj: ReviewForecastObjectType[] = []
    const todaysDay = (new Date()).getDay()
    let dayWithCardsFound = false
    let maxAmtOfCardsInAnHr = 0
    for (let i = 0; i < 7; ++i) {
      const currentDay = (todaysDay + i) % 7
      const cardDates = srsCardDates.filter(date =>
        date.getDay() === currentDay
      )

      let firstDayWithCards = false
      if ((!dayWithCardsFound && cardDates.length > 0)) {
        firstDayWithCards = true
        dayWithCardsFound = true
      }

      const newCardTimesByHour: number[] = []
      for (let i = 0; i < 24; i++) {
        newCardTimesByHour.push(0)
      }
      for (const cardTime of cardDates) {
        newCardTimesByHour[cardTime.getHours()] += 1
        maxAmtOfCardsInAnHr = Math.max(maxAmtOfCardsInAnHr, newCardTimesByHour[cardTime.getHours()])
      }
      newReviewsForecastObj.push(
        {
          day: currentDay,
          cardTimesByHour: newCardTimesByHour,
          isToday: i === 0,
          firstDayWithCards,
          cardTotalBeforeThisDay: runningTotalOfAmtOfCardsEachDay
        }
      )
      runningTotalOfAmtOfCardsEachDay += cardDates.length
    }

    changeMaxAmtOfCardsInAnHour(maxAmtOfCardsInAnHr)
    changeReviewForecastObjectsType(newReviewsForecastObj)
    changeTotalAmtOfCardsThisWeek(runningTotalOfAmtOfCardsEachDay)
  }, [allSrsCards, amtOfSrsCardsToReviewNow])

  return (
        <div className='side-bar-section'>
            <h2 className='side-bar-header upcoming-reviews-header'>
                Upcoming Reviews
            </h2>
            {reviewsExist && <p className='reviews-forecast-description'>See how many more reviews you will get each day</p>}
            {
                amtOfSrsCardsToReviewNow === 0 && (
                <div
                    className='side-bar-link what-does-this-chart-mean how-to-read-chart-note'
                    style={{ display: amtOfSrsCardsToReviewNow === 0 ? 'none' : 'block' }}
                    onMouseOver={() => changeExplainChartMeaning(true)}
                    onMouseLeave={() => changeExplainChartMeaning(false)}
                >
                    {
                        explainChartMeaning
                          ? `
                        The left column shows the amount of 
                        reviews you will gain and the right column
                        shows the total number of reviews you will
                        have at that time
                        `
                          : 'What does this chart mean?'
                    }
                </div>
                )}

            {
                reviewsExist
                  ? 
                  <>
                    <div className='each-days-forecast-container'>
                      {reviewForecastObjects.map((props: ReviewForecastObjectType) =>
                          <ForecastTab
                              key={props.day}
                              {...props}
                              maxAmtOfCardsInAnHour={maxAmtOfCardsInAnHour}
                          />
                      )}
                    </div>
                    <p className='total-amt-of-cards-to-review-this-week'>{totalAmtOfCardsThisWeek} more reviews this week</p>
                  </>
                  : <div className='no-upcoming-reviews-msg'>
                    {
                        amtOfSrsCardsToReviewNow === 0
                          ? `You have no upcoming reviews this week. Feel free to 
                        do some lessons or even take a break!`
                          : `You have no upcoming reviews for this week yet. I see
                        though that you have some reviews to do so lets get to it!`
                    }
                </div>
            }
        </div>
  )
}