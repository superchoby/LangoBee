import { Lessons } from '..'
import { screen } from '@testing-library/react'
import { renderWithProviders } from 'src/__mocks__/Provider'
import { BrowserRouter } from 'react-router-dom'
import { JapaneseDatabaseProvider } from '../../../context/JapaneseDatabaseContext/JapaneseDatabaseContext'
import { server } from 'src/__mocks__/server'

const MockLessons = (): JSX.Element => {
  return (
        <BrowserRouter>
            <JapaneseDatabaseProvider>
                <Lessons />
            </JapaneseDatabaseProvider>
        </BrowserRouter>
  )
}

describe('Lessons Tests', () => {
  beforeAll(() => { server.close() })

  it('Renders lesson introduction on first load', () => {
    renderWithProviders(<MockLessons />)
    const letsGoButton = screen.queryByText("Let's Go!")
    expect(letsGoButton).toBeInTheDocument()
  })

  // ERROR WIT JAPANESE DATABASE FETCH MOST LIKELY
  //   it('Renders shows actual lesson after clicking lets go on lesson introduction', async () => {
  //     renderWithProviders(<MockLessons />)
  //     const letsGoButton = screen.getByTestId('asdf')
  //     fireEvent.click(letsGoButton)
  //     // This is a button contained with the actual lessons area
  //     screen.debug()
  //     const hideExplanationButton = await screen.findByText('Hide Explanations')
  //     expect(hideExplanationButton).toBeInTheDocument()
  //   })

  it('Completed all current lessons message shows', () => {
    const mockPreloadedState = {
      username: '',
      email: '',
      currentLesson: '10000',
      currentSplit: 2,
      experiencePoints: 0,
      readMsgForCurrentLevel: true,
      profilePicture: '',
      datesStudied: [],
      dateJoined: ''
    }
    renderWithProviders(<MockLessons />, { preloadedState: { user: mockPreloadedState } })
    const lookForwardMsg = screen.getByText('We hope you look forward to it!')
    expect(lookForwardMsg).toBeInTheDocument()
  })
})
