import { createSlice } from '@reduxjs/toolkit'

type LanguageChoices = 'Japanese'
type CourseChoices = 'JLPT'

type ProgressOnEachLanguagesCourses = {
  [language in LanguageChoices]: {
    [course in CourseChoices]: {
      currentLesson: number
      currentSplitOnLesson: number
    }
  }
}

export interface DatesStudiedType {
  expGained: number
  date: Date
}

export interface UserSliceStateType {
  username: string
  email: string
  experiencePoints: number
  readMsgForCurrentLevel: boolean
  profilePicture: string
  datesStudied: DatesStudiedType[]
  dateJoined: string
  progressOnCourses: ProgressOnEachLanguagesCourses
  languages: LanguageChoices[]
  timesReviewCardsWereAdded: Date[]
  srsLimit: number
  numOfSubjectsToTeachPerLesson: number
  hasAccessToPaidFeatures: boolean
  isOnFreeTrial: boolean
}

export const userSliceInitialState: UserSliceStateType = {
  username: '',
  email: '',
  experiencePoints: 0,
  readMsgForCurrentLevel: false,
  profilePicture: '',
  datesStudied: [],
  dateJoined: (new Date()).toString(),
  progressOnCourses: {
    Japanese: {
      JLPT: {
        currentLesson: 1,
        currentSplitOnLesson: 1
      }
    }
  },
  languages: ['Japanese'],
  timesReviewCardsWereAdded: [],
  srsLimit: 15,
  numOfSubjectsToTeachPerLesson: 5,
  hasAccessToPaidFeatures: false,
  isOnFreeTrial: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState: userSliceInitialState,
  reducers: {
    updateUserInfo: (state, action) => {
      const {
        username,
        email,
        experience_points,
        readMsgForCurrentLevel,
        profilePicture,
        datesStudied,
        dateJoined,
        srsLimit,
        numOfSubjectsToTeachPerLesson,
        hasAccessToPaidFeatures,
        isOnFreeTrial
      } = action.payload

      state.username = (username.charAt(0).toUpperCase() as string) + (username.slice(1).toLowerCase() as string)
      state.email = email
      state.experiencePoints = experience_points
      state.readMsgForCurrentLevel = readMsgForCurrentLevel
      state.profilePicture = profilePicture
      state.numOfSubjectsToTeachPerLesson = numOfSubjectsToTeachPerLesson
      state.hasAccessToPaidFeatures = hasAccessToPaidFeatures
      state.isOnFreeTrial = isOnFreeTrial
      
      interface DatesStudiedElementType {
        expGained: number
        date: string
      }
      state.datesStudied = datesStudied
        .map((datesStudiedElement: DatesStudiedElementType) => {
          // const dateSplit = datesStudiedElement.date.split('-').map(dateNum => Number(dateNum))
          const dateConvertedToLocalTimezone = new Date(datesStudiedElement.date)
          return {
            ...datesStudiedElement,
            date: new Date(
              dateConvertedToLocalTimezone.getFullYear(),
              dateConvertedToLocalTimezone.getMonth(),
              dateConvertedToLocalTimezone.getDate()
            )
          }
        })
      state.dateJoined = dateJoined
      state.timesReviewCardsWereAdded = []
      state.srsLimit = srsLimit
    },
    updateProfilePic: (state, action) => {
      const {
        profilePicture
      } = action.payload

      state.profilePicture = profilePicture
    },
    setIntroMsgAsRead: (state) => {
      state.readMsgForCurrentLevel = true
    },
    userAddedMoreSubjectsToReview: (state) => {
      state.timesReviewCardsWereAdded = [...state.timesReviewCardsWereAdded, new Date()]
    },
    resetUser: (_state) => {
      return userSliceInitialState
    },
    updateSrsLimit: (state, action) => {
      const {
        newSrsLimit
      } = action.payload
      state.srsLimit = newSrsLimit
    },
    updateSubjectsPerSessionLimit: (state, action) => {
      const {
        newSubjectsPerSessionLimit
      } = action.payload
      state.numOfSubjectsToTeachPerLesson = newSubjectsPerSessionLimit
    }
  }
})

export const {
  updateUserInfo,
  setIntroMsgAsRead,
  resetUser,
  updateProfilePic,
  userAddedMoreSubjectsToReview,
  updateSrsLimit,
  updateSubjectsPerSessionLimit
} = userSlice.actions

const expNeededForThisLevel = (currentLevel: number): number => {
  if (currentLevel < 5) {
    return 500
  } else if (currentLevel < 10) {
    return 800
  } else if (currentLevel < 15) {
    return 1500
  } else {
    return 2000
  }
}

export const getLevelInfo = (experiencePoints: number): {
  currentLevel: number
  expUntilNextLevel: number
  expPerLevel: number
} => {
  let expLeft = experiencePoints
  let currentLevel = 1

  while (expLeft >= expNeededForThisLevel(currentLevel)) {
    expLeft = expLeft - expNeededForThisLevel(currentLevel)
    currentLevel = currentLevel + 1
  }

  return {
    currentLevel,
    expUntilNextLevel: expNeededForThisLevel(currentLevel) - expLeft,
    expPerLevel: expNeededForThisLevel(currentLevel)
  }
}

export default userSlice.reducer
