import { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import {
  UserSliceStateType,
  userSliceInitialState
} from '../app/userSlice'
import {
  SRSFlashcardsState,
  srsFlashcardsInitialState
} from '../app/srsFlashcardsSlice'

import type { store, RootState } from '../app/store'
import { persistedReducer } from '../app/store'

type MockStateType = Partial<{
  user: Partial<UserSliceStateType>
  srsFlashcards: Partial<SRSFlashcardsState>
}>

export const mockReduxState = (propsToOverride: MockStateType) => {
  return {
    user: {
      ...userSliceInitialState,
      ...propsToOverride.user
    },
    srsFlashcards: {
      ...srsFlashcardsInitialState,
      ...propsToOverride.srsFlashcards
    }
  }
}

// As a basic setup, import your same slice reducers

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: typeof store
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function renderWithProviders (
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer: persistedReducer, preloadedState }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper ({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
