import './CardsForHour.scss'

export interface CardsForHourProps {
  hour: number
  numOfCards: number
  maxAmtOfCardsInAnHour: number
  cardsRunningTotal: number
}

export const CardsForHour = ({
  hour,
  numOfCards,
  maxAmtOfCardsInAnHour,
  cardsRunningTotal
}: CardsForHourProps): JSX.Element => {
  const ampm = hour >= 12 ? 'pm' : 'am'
  let hours = hour % 12
  hours = (hours === 0) ? 12 : hours
  const hourString = `${hours} ${ampm}`

  return (
        <div className='cards-for-hour'>
            <div className='hour-string'>
                {hourString}
            </div>

            <div className='cards-in-an-hr-bar-container'>
                <div className='cards-in-an-hr-bar' style={{ width: `${(numOfCards / maxAmtOfCardsInAnHour) * 100}%` }} />
            </div>

            <div className='reviews-gained-and-total-container'>
                <div className='review-forecast-cards-gained-in-an-hour'>
                    +{numOfCards}
                </div>

                {/* <div className='review-forecast-cards-total'>
                    {cardsRunningTotal}
                </div> */}
            </div>
        </div>
  )
}
