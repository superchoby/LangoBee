import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  access: '',
  refresh: ''
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    updateToken: (state, action) => {
      const {
        access,
        refresh
      } = action.payload
      console.log(action.payload)
      state.access = access
      state.refresh = refresh
    },
    resetToken: (_state) => {
      return initialState
    }
  }
})

export const { updateToken, resetToken } = tokenSlice.actions

export default tokenSlice.reducer
