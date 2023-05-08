import { CardsForHour, type CardsForHourProps } from '../CardsForHour'
import { render, screen } from '@testing-library/react'

const MockCardsForHour = (propsToOverride: Partial<CardsForHourProps>): JSX.Element => {
  return (
        <CardsForHour
            hour={1}
            numOfCards={0}
            maxAmtOfCardsInAnHour={0}
            cardsRunningTotal={0}
            {...propsToOverride}
        />
  )
}

describe('ReviewForecast CardsForHour', () => {
  describe('Hour is listed properly', () => {
    it('when it is an am time', () => {
      render(<MockCardsForHour hour={5} />)
      expect(screen.queryByText('5 am')).toBeInTheDocument()
    })

    it('when it is an pm time', () => {
      render(<MockCardsForHour hour={17} />)
      expect(screen.queryByText('5 pm')).toBeInTheDocument()
    })
  })

  it('Shows how many cards are gained in a specific hour', () => {
    render(<MockCardsForHour numOfCards={10} />)
    expect(screen.queryByText('+10')).toBeInTheDocument()
  })

  it('Shows total amt of cards user will have at a given hour', () => {
    render(<MockCardsForHour cardsRunningTotal={100} />)
    expect(screen.queryByText('100')).toBeInTheDocument()
  })
})
