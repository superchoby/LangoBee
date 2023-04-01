import {
  ForecastTab,
  ForecastTabProps,
  UPWARDS_CARET_TESTID,
  DOWNWARDS_CARET_TESTID
} from '../ForecastTab'
import { screen, render, fireEvent } from '@testing-library/react'

const MockForecastTab = (propsToOverride: Partial<ForecastTabProps>): JSX.Element => {
  return (
        <ForecastTab
            day={0}
            cardTimesByHour={[1]}
            isToday={false}
            firstDayWithCards={false}
            maxAmtOfCardsInAnHour={0}
            cardTotalBeforeThisDay={0}
            {...propsToOverride}
        />
  )
}

describe('ReviewForecast ForecastTab', () => {
  it('is open by default when it is the first day to have cards', () => {
    render(<MockForecastTab firstDayWithCards={true}/>)
    expect(screen.queryByTestId(UPWARDS_CARET_TESTID)).toBeInTheDocument()
  })

  it('is closed by default when it is not the first day to have cards', () => {
    render(<MockForecastTab firstDayWithCards={false}/>)
    expect(screen.queryByTestId(DOWNWARDS_CARET_TESTID)).toBeInTheDocument()
  })

  it('opens and closes on click when there are cards gained on this day', () => {
    render(<MockForecastTab cardTimesByHour={[1]} />)
    const downwardsCaretElement = screen.getByTestId(DOWNWARDS_CARET_TESTID)
    fireEvent.click(downwardsCaretElement)
    const upwardsCaretElement = screen.getByTestId(UPWARDS_CARET_TESTID)
    expect(upwardsCaretElement).toBeInTheDocument()
    fireEvent.click(upwardsCaretElement)
    expect(screen.getByTestId(DOWNWARDS_CARET_TESTID)).toBeInTheDocument()
  })

  it('Day is labeled as "today" if the ForecastTab represents info for today', () => {
    render(<MockForecastTab isToday={true} />)
    expect(screen.queryByText('Today')).toBeInTheDocument()
  })

  it('Day is labeled as the actual day of the week (e.g Monday, Tuesday, etc.) if the ForecastTab does not represent info for today', () => {
    render(<MockForecastTab day={1} isToday={false} />)
    expect(screen.queryByText('Monday')).toBeInTheDocument()
  })

  it("Tab stays closed and can't be opened if there are no review cards for the day", () => {
    render(<MockForecastTab cardTimesByHour={[]} />)
    const downwardsCaretElement = screen.getByTestId(DOWNWARDS_CARET_TESTID)
    fireEvent.click(downwardsCaretElement)
    expect(screen.getByTestId(DOWNWARDS_CARET_TESTID)).toBeInTheDocument()
  })

  it('Correctly shows how many cards will be gained on the given day and the total amount of review cards by the end of the day', () => {
    const exampleCardTimesByHour = [100, 200, 3000]
    const exampleCardTimesByHourSum = exampleCardTimesByHour.reduce((partialSum, a) => partialSum + a, 0)
    const exampleCardTotalBeforeThisDay = 1000
    render(<MockForecastTab cardTimesByHour={exampleCardTimesByHour} cardTotalBeforeThisDay={exampleCardTotalBeforeThisDay} />)
    expect(screen.queryByText(`+${exampleCardTimesByHourSum}`)).toBeInTheDocument()
    expect(screen.queryAllByText(`${exampleCardTimesByHourSum + exampleCardTotalBeforeThisDay}`)).toHaveLength(2)
  })

  it('All hours are displayed and the cards gained that hour and the total are written', () => {
    const exampleCardTimesByHour = [100, 200, 3000]
    const exampleCardTotalBeforeThisDay = 1000
    render(
            <MockForecastTab
                cardTimesByHour={exampleCardTimesByHour}
                cardTotalBeforeThisDay={exampleCardTotalBeforeThisDay}
                isToday={false}
            />
    )

    let runningTotal = exampleCardTotalBeforeThisDay
    for (let i = 0; i < exampleCardTimesByHour.length; ++i) {
      const hour = i === 0 ? 12 : i
      runningTotal += exampleCardTimesByHour[i]
      expect(screen.getByText(`+${exampleCardTimesByHour[i]}`)).toBeInTheDocument()
      expect(screen.queryAllByText(`${runningTotal}`).length > 0).toBeTruthy()
      expect(screen.queryByText(`${hour} am`)).toBeInTheDocument()
    }
  })
})
