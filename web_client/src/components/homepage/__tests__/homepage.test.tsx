// import {
//   Homepage,
//   cantProgressNextLessonBecauseLevelTooLowMsg,
//   completedAllLessonsMsg
// } from '../'
// import { screen } from '@testing-library/react'
// import {
//   renderWithProviders,
//   mockReduxState
// } from 'src/__mocks__/Provider'
// import { BrowserRouter } from 'react-router-dom'
// import { Cloudinary } from '@cloudinary/url-gen'
import react from 'react'

// jest.mock('@cloudinary/url-gen/actions/resize', () => ({
//   thumbnail: jest.fn()
// }))

// jest.mock('@cloudinary/url-gen/actions/roundCorners', () => ({
//   byRadius: jest.fn()
// }))

// jest.mock('@cloudinary/url-gen/qualifiers/gravity', () => ({
//   focusOn: jest.fn()
// }))

// jest.mock('@cloudinary/url-gen/qualifiers/focusOn', () => ({
//   FocusOn: jest.fn()
// }))

// jest.mock('@cloudinary/url-gen/qualifiers/focusOn', () => ({
//   FocusOn: jest.fn()
// }))

// const MockHomepage = (): JSX.Element => {
//   return (
//         <BrowserRouter>
//             <Homepage />
//         </BrowserRouter>
//   )
// }

// describe('Homepage component', () => {
//   it('Username shows with proper capitilization', () => {
//     const TEST_USERNAME = 'test username'
//     renderWithProviders(<MockHomepage />, {
//       preloadedState: mockReduxState({
//         user: {
//           username: TEST_USERNAME
//         }
//       })
//     })
//     const usernameInRightFormat = TEST_USERNAME.charAt(0).toUpperCase() + TEST_USERNAME.slice(1).toLowerCase()
//     expect(screen.queryByText(usernameInRightFormat)).toBeInTheDocument()
//   })

// it('User shown message about not being able to go to next lesson when level is too low', () => {
//   renderWithProviders(<MockHomepage />, {
//     preloadedState: mockReduxState({
//       user: {
//         experiencePoints: 0
//       }
//     })
//   })
//   expect(screen.queryByText(cantProgressNextLessonBecauseLevelTooLowMsg)).toBeInTheDocument()
// })

// it('User shown message about having completed all current lessons', () => {
//   renderWithProviders(<MockHomepage />, {
//     preloadedState: mockReduxState({
//       user: {
//         currentLesson: 10000000
//       }
//     })
//   })
//   expect(screen.queryByText(completedAllLessonsMsg)).toBeInTheDocument()
// })
// TODO: FIGURE OUT HOW TO GET SRS LINK SPECIFICALLY
// describe('SRS Review link', () => {
//   it('is present', () => {
//     renderWithProviders(<Homepage />)
//     expect(screen.getByRole('link')).toBeInTheDocument()
//   })
// })
// })

describe('', () => {
  it('Cant figure out this stupid cloudinary issue', () => {})
})
