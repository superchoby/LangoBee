import { createSlice } from '@reduxjs/toolkit'

interface SrsCards {
  conceptToReview: string
  nextReviewDate: string
  currentLevel: {
    stage: number
    systemThisBelongsTo: {
      name: 'fast' | 'default'
    }
  }
  userAlreadyKnowsThis: boolean
}

// currentStage: number
//     isFastReviewCard: boolean

export interface SRSFlashcardsState {
  srsCardsToReview: SrsCards[]
  allSrsCards: SrsCards[]
}

export const srsFlashcardsInitialState: SRSFlashcardsState = {
  srsCardsToReview: [],
  allSrsCards: []
}

export const srsFlashcardsSlice = createSlice({
  name: 'srsFlashcards',
  initialState: srsFlashcardsInitialState,
  reducers: {
    updateSrsFlashcards: (state, action) => {
      const {
        srsCardsToReview,
        allSrsCards
      } = action.payload

      state.srsCardsToReview = srsCardsToReview
      state.allSrsCards = allSrsCards
    },
    resetSrsFlashcards: (_state) => {
      return srsFlashcardsInitialState
    }
  }
})

export const { updateSrsFlashcards, resetSrsFlashcards } = srsFlashcardsSlice.actions

export default srsFlashcardsSlice.reducer
