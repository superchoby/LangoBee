import { EachLessonsContent } from '../../session/LessonsPlan'
import { LessonIntroduction, LessonIntroductionsObj } from '../index'
// @ts-expect-error For some reason says wait is not defined when it does exist
import { screen, fireEvent, wait } from '@testing-library/react'
import { renderWithProviders } from '../../../../__mocks__/Provider'

describe('LessonIntroductions', () => {
  it('every lesson has an introduction', () => {
    for (const key of Object.keys(EachLessonsContent)) {
      expect(Object.keys(LessonIntroductionsObj).includes(key)).toBeTruthy()
    }
  })

  it("Clicking 'Let's go' dispatches this lesson's intro message as read", async () => {
    const { store } = renderWithProviders(<LessonIntroduction introToUse='5' />)
    expect(store.getState().user.readMsgForCurrentLevel).not.toBeTruthy()
    const letsGoButton = screen.getByText("Let's Go!")
    fireEvent.click(letsGoButton)
    await wait(() => expect(store.getState().user.readMsgForCurrentLevel).toBeTruthy())
  })
})
