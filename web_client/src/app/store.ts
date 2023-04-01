import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit'
import tokenReducer from './tokenSlice'
import srsFlashcardsReducer from './srsFlashcardsSlice'
import storage from 'redux-persist/lib/storage'
// import { createMigrate, persistReducer } from 'redux-persist'
import { persistReducer } from 'redux-persist'
import userReducer from './userSlice'
import thunk from 'redux-thunk'

const reducers = combineReducers({
  token: tokenReducer,
  user: userReducer,
  srsFlashcards: srsFlashcardsReducer
})

const persistConfig = {
  key: 'root',
  storage
}

export const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>
