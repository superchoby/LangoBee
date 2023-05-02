import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { Dispatch } from 'react'
import type { AnyAction } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): Dispatch<AnyAction> => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
