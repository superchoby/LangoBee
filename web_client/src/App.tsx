import { Homepage } from './components/homepage'
import { useEffect, useState } from 'react'
import './App.scss'
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  useNavigate, 
  Outlet, 
  createSearchParams,
  useLocation
} from 'react-router-dom'
import { Lessons } from './components/learning/lessons'
import { Login } from './components/authentication/login'
import { Signup } from './components/authentication/signup'
import { Reviews } from './components/learning/reviews'
import axios from 'axios'
import { NotFoundPage } from './components/ErrorPages/404NotFound'
import { DefaultPage } from './DefaultPage'
import { InformationOnReviews } from './components/InformationAboutSitePages/ReviewsInfo'
import { Settings } from '../src/components/settings'
import { ForgotPassword } from './components/authentication/ForgotPassword'
import { ResetPassword } from './components/authentication/ResetPassword'
import { ImmersionLevelInfo } from './components/InformationAboutSitePages/ImmersionLevelInfo'
import { resetUser, updateUserInfo } from './app/userSlice'
import { resetToken, updateToken } from './app/tokenSlice'
import { resetSrsFlashcards, updateSrsFlashcards } from './app/srsFlashcardsSlice'
import { keysToCamel } from './components/shared/keysToCamel'
import { ContactUs } from './components/ContactUs'
import { ArticlesHomepage } from './components/Articles/ArticlesHomepage'
import { TestToSkipLevels } from './components/learning/lessons/TestToSkipLevels'
import { Article } from './components/Articles/Article'
import { useAppSelector, useAppDispatch } from './app/hooks'
import { store } from './app/store'
import { HeaderAndNavbar } from './components/HeaderAndNavbar'
import { StatisticsSection } from './components/Statistics'
import { SubscriptionsPage } from './components/Subscription'
import { Privacy } from './components/Legal/Privacy'
import { TermsOfService } from './components/Legal/TermsOfService'
import { Checkout } from './components/Subscription/Checkout'
import { Dictionary } from './components/Dictionary'
import {
  LOGIN_PATH,
  HOME_PATH,
  EXERCISES_PATH,
  STATISTICS_PATH,
  REVIEWS_PATH,
  LESSONS_PATH,
  LESSONS_SESSION_PATH,
  ARTICLE_PATH,
  STORIES_HOME_PATH,
  READ_STORY,
  REVIEWS_INFO_PATH,
  CONTACT_US_PATH,
  SUBSCRIPTION_PATH,
  CHECKOUT_PATH,
  TERMS_OF_SERVICE_PATH,
  PRIVACY_PATH,
  TEST_PATH,
  DICTIONARY_PATH,
  ARTICLE_HOMEPAGE_PATH,
  FORGOT_PASSWORD_PATH,
  IMMERSION_LEVEL_INFO_PATH,
  SETTINGS_PATH,
  RESET_PASSWORD_PATH,
  SIGN_UP_PATH,
  PAGE_TITLE_NAMES
} from './paths'
import { Exercises } from './components/Exercises/ExercisesSelection'
import { ActualExercise } from './components/Exercises/ActualExercise'
import { LessonSession } from './components/learning/lessons/session'
import { StoriesHome } from './components/stories/StoriesHome'
import { StoryReader } from './components/stories/StoryReader'
import { getUserIsAuthenticatedObj } from './components/shared/useUserIsAuthenticated'
import { hotjar } from 'react-hotjar';
import { useAuth0 } from "@auth0/auth0-react";

const tokenInvalidMsg = 'Given token not valid for any token type'
const userNotFoundMessage = 'User not found'
const isInDevelopmentEnv = process.env.NODE_ENV == null || process.env.NODE_ENV === 'development'

axios.defaults.baseURL = isInDevelopmentEnv ? 'http://127.0.0.1:8000/' : 'https://langobee-server.herokuapp.com/'

const ResetUserInfoWrapper = ({ children }: { children: JSX.Element }): JSX.Element => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(resetToken())
    dispatch(resetSrsFlashcards())
    dispatch(resetUser())
    delete axios.defaults.headers.common.Authorization
  }, [dispatch])

  return children
}

const ProtectedRoute = ({
  ComponentToRender
}: {ComponentToRender?: JSX.Element}): JSX.Element => {
  const location = useLocation()
  const { access, refresh } = useAppSelector(state => state.token)
  const [finishedVerifyingToken, setFinishedVerifyingToken] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loginWithRedirect, getAccessTokenSilently, user } = useAuth0();
 
  useEffect(() => {
    document.title = PAGE_TITLE_NAMES.hasOwnProperty(location.pathname) ? PAGE_TITLE_NAMES[location.pathname] : 'LangoBee'
  }, [location])

  useEffect(() => {
    const setUpAxiosAndGetBaseInfo = async () => {
      // const accessToken = await getAccessTokenSilently()
      // console.log(accessToken)
      axios.get('users/homepage/', {
              headers: { Authorization: `Bearer ${access}` }
          })
          .then(res => {
            const {
              review_cards: reviewCardsData,
              username,
              email,
              experience_points: experiencePoints,
              readMsgForCurrentLevel,
              profile_picture: profilePicture,
              dates_studied: datesStudied,
              date_joined: dateJoined,
              srs_limit: srsLimit,
              num_of_subjects_to_teach_per_lesson: numOfSubjectsToTeachPerLesson,
              has_access_to_paid_features: hasAccessToPaidFeatures,
              user_is_on_free_trial: isOnFreeTrial,
              wants_reminder_emails: wantsReminderEmails,
              reminder_emails_review_threshold: reminderEmailsReviewThreshold,
            } = res.data

            dispatch(updateUserInfo({
              username,
              email,
              experiencePoints,
              readMsgForCurrentLevel,
              profilePicture,
              datesStudied,
              dateJoined,
              srsLimit,
              numOfSubjectsToTeachPerLesson,
              hasAccessToPaidFeatures,
              isOnFreeTrial,
              wantsReminderEmails,
              reminderEmailsReviewThreshold
            }))
            const reviewCards = reviewCardsData.map((card: any) => keysToCamel(card))
            dispatch(updateSrsFlashcards({
              srsCardsToReview: reviewCards.filter(({ nextReviewDate }: any) => nextReviewDate != null && ((new Date(nextReviewDate)) <= new Date())),
              allSrsCards: reviewCards
            }))
          })
          .catch(err => {
            console.log(err)
          })
      
      // axios.post(verifyTokenPath, { token: accessToken })
      // .then(_res => {
      //   setFinishedVerifyingToken(true)
      //   axios.interceptors.request.use(
      //     (config) => {
      //       // const { access } = store.getState().token
      //       if (access.length > 0) {
      //         config.headers.Authorization = `Bearer ${accessToken}`
      //       } else {
      //         config.headers.Authorization = ''
      //       }
      //       return config
      //     },
      //     async (error) => {
      //       return await Promise.reject(error)
      //     }
      //   )

      //   axios.interceptors.response.use(function (response) {
      //     return response
      //   }, async function (error) {
      //     const { response, config } = error
      //     const is401Error = typeof response !== 'undefined' && response.status === 401
      //     const tokenIsInvalidOrUserNotFound = response.data.detail === tokenInvalidMsg || response.data.detail === userNotFoundMessage
      //     if (is401Error && Object.keys(response.data).includes('detail') && tokenIsInvalidOrUserNotFound) {
      //       if (config._retry == null) {
      //         config._retry = true
      //         try {
      //           // const res = await (axios.post('api/token/refresh/', {
      //           //   refresh: store.getState().token.refresh
      //           // }))
      //           // const {
      //           //   access,
      //           //   refresh
      //           // } = res.data

      //           // store.dispatch(updateToken({
      //           //   refresh,
      //           //   access
      //           // }))

      //           return await axios(config)
      //         } catch (error) {
      //           loginWithRedirect()
      //           // window.location.href = isInDevelopmentEnv ? `http://localhost:3000${LOGIN_PATH}` : `https://www.langobee.com${LOGIN_PATH}`
      //         }
      //       }
      //     }
      //     return await Promise.reject(error)
      //   })
      //   axios.get('users/homepage/')
      //     .then(res => {
      //       const {
      //         review_cards: reviewCardsData,
      //         username,
      //         email,
      //         experience_points: experiencePoints,
      //         readMsgForCurrentLevel,
      //         profile_picture: profilePicture,
      //         dates_studied: datesStudied,
      //         date_joined: dateJoined,
      //         srs_limit: srsLimit,
      //         num_of_subjects_to_teach_per_lesson: numOfSubjectsToTeachPerLesson,
      //         has_access_to_paid_features: hasAccessToPaidFeatures,
      //         user_is_on_free_trial: isOnFreeTrial,
      //         wants_reminder_emails: wantsReminderEmails,
      //         reminder_emails_review_threshold: reminderEmailsReviewThreshold,
      //       } = res.data

      //       dispatch(updateUserInfo({
      //         username,
      //         email,
      //         experiencePoints,
      //         readMsgForCurrentLevel,
      //         profilePicture,
      //         datesStudied,
      //         dateJoined,
      //         srsLimit,
      //         numOfSubjectsToTeachPerLesson,
      //         hasAccessToPaidFeatures,
      //         isOnFreeTrial,
      //         wantsReminderEmails,
      //         reminderEmailsReviewThreshold
      //       }))
      //       const reviewCards = reviewCardsData.map((card: any) => keysToCamel(card))
      //       dispatch(updateSrsFlashcards({
      //         srsCardsToReview: reviewCards.filter(({ nextReviewDate }: any) => nextReviewDate != null && ((new Date(nextReviewDate)) <= new Date())),
      //         allSrsCards: reviewCards
      //       }))
      //     })
      //     .catch(err => {
      //       console.log(err)
      //     })
      // })
      // .catch(_err => {
      //   axios.post(verifyTokenPath, { token: refresh })
      //     .then(_res => {
      //       setFinishedVerifyingToken(true)
      //       navigate(HOME_PATH)
      //     })
      //     .catch(_err => {
      //       setFinishedVerifyingToken(false)
      //       loginWithRedirect()
      //       // navigate(LOGIN_PATH)
      //     })
      // })
    } 
    setUpAxiosAndGetBaseInfo()
    
  }, [
    access, 
    dispatch, 
    navigate, 
    refresh, 
    loginWithRedirect, 
    getAccessTokenSilently
  ])

  return finishedVerifyingToken ? (ComponentToRender == null ? <Outlet context={getUserIsAuthenticatedObj(true)} /> : ComponentToRender) : <></>
}

const RoutesAvailableForNonAuthAndAuthUsers = () => {
  const { access } = useAppSelector(state => state.token)

  return access === '' ? <Outlet context={getUserIsAuthenticatedObj(false)} /> : <ProtectedRoute ComponentToRender={<Outlet context={getUserIsAuthenticatedObj(true)} />}/>
}

const PaidUsersOnlyRoute = () => {
  const { hasAccessToPaidFeatures } = useAppSelector(state => state.user)
  const navigate = useNavigate()

  if (!hasAccessToPaidFeatures) {
    navigate({
      pathname: SUBSCRIPTION_PATH,
      search: createSearchParams({
          tried_to_access_paid_feature: "true"
      }).toString()
    });
  }

  return <Outlet />
}

const verifyTokenPath = 'api/token/verify/'
const hotjarSiteId = 3501001;
const hotjarVersion = 6;
hotjar.initialize(hotjarSiteId, hotjarVersion);

function App () {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<PaidUsersOnlyRoute />}>
              <Route path={LESSONS_SESSION_PATH} element={<LessonSession />} />
              <Route path={REVIEWS_PATH} element={(<Reviews />)} />
              <Route path={READ_STORY} element={<StoryReader />} />
              <Route path={`${EXERCISES_PATH}/:exerciseName`} element={<ActualExercise />} />
              <Route path={`${TEST_PATH}/:testSlug`} element={<TestToSkipLevels />} />
            </Route>
            <Route path={HOME_PATH} element={<HeaderAndNavbar PageContents={<Homepage />} hasGapBetweenHeaderAndContents={true} />} />
            <Route path={LESSONS_PATH} element={<HeaderAndNavbar PageContents={<Lessons />} hasGapBetweenHeaderAndContents={true} />} />
            <Route path={CONTACT_US_PATH} element={<HeaderAndNavbar PageContents={<ContactUs />} hasGapBetweenHeaderAndContents={true} />} />
            <Route path={STORIES_HOME_PATH} element={<HeaderAndNavbar PageContents={<StoriesHome />} hasGapBetweenHeaderAndContents={true} />} />
            <Route path={EXERCISES_PATH} element={<HeaderAndNavbar PageContents={<Exercises />} hasGapBetweenHeaderAndContents={true} />} />
            <Route path={STATISTICS_PATH} element={<HeaderAndNavbar PageContents={<StatisticsSection />} hasGapBetweenHeaderAndContents={true} />} />
            <Route path={SUBSCRIPTION_PATH} element={<HeaderAndNavbar PageContents={<SubscriptionsPage />} hasGapBetweenHeaderAndContents={true} />} />
            {/* <Route path={`${CHECKOUT_PATH}/success`} element={<HeaderAndNavbar PageContents={<Checkout />} hasGapBetweenHeaderAndContents={true} />} /> */}
            <Route path={CHECKOUT_PATH} element={<HeaderAndNavbar PageContents={<Checkout />} hasGapBetweenHeaderAndContents={true} />} />
            <Route path={REVIEWS_INFO_PATH} element={<InformationOnReviews />} />
            <Route path={IMMERSION_LEVEL_INFO_PATH} element={<ImmersionLevelInfo />} />
            <Route path={SETTINGS_PATH} element={<HeaderAndNavbar PageContents={<Settings />} hasGapBetweenHeaderAndContents={true} />} />
            <Route path={ARTICLE_PATH(true)} element={<Article />} />
          </Route>

          <Route element={<RoutesAvailableForNonAuthAndAuthUsers />}>
            <Route path={ARTICLE_PATH(false)} element={<Article />} />
            <Route path={`${DICTIONARY_PATH}/:word?`} element={<HeaderAndNavbar PageContents={<Dictionary />} hasGapBetweenHeaderAndContents={true} />} />
            <Route path={ARTICLE_HOMEPAGE_PATH} element={<ArticlesHomepage />} />
          </Route>

          <Route path={PRIVACY_PATH} element={<Privacy />} />
          <Route path={TERMS_OF_SERVICE_PATH} element={<TermsOfService />} />
          <Route path={LOGIN_PATH} element={(
            <ResetUserInfoWrapper>
              <Login />
            </ResetUserInfoWrapper>
          )} />
          <Route path={SIGN_UP_PATH} element={(
            <ResetUserInfoWrapper>
              <Signup />
            </ResetUserInfoWrapper>
          )} />
          <Route path={FORGOT_PASSWORD_PATH} element={(
            <ResetUserInfoWrapper>
              <ForgotPassword />
            </ResetUserInfoWrapper>
          )} />
          <Route path={`${RESET_PASSWORD_PATH}/:reset_token`} element={(
            <ResetUserInfoWrapper>
              <ResetPassword />
            </ResetUserInfoWrapper>
          )} />
          <Route path="/" element={<DefaultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
