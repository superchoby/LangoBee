export const IS_IN_DEV_MODE = process.env.NODE_ENV == null || process.env.NODE_ENV === 'development'
export const ROOT_PATH = IS_IN_DEV_MODE ? 'http://localhost:8080/' : '/'
export const HOME_PATH = '/home'
export const STORIES_HOME_PATH = '/stories'
export const READ_STORY = '/stories/:language/:slug'
export const EXERCISES_PATH = '/exercises'
export const PROFILE_PATH = '/profile'
export const STATISTICS_PATH = '/statistics'
export const REVIEWS_PATH = '/reviews'
export const LESSONS_PATH = '/lessons'
export const REVIEWS_INFO_PATH = '/reviews-info'
export const LESSONS_SESSION_PATH = `${LESSONS_PATH}/session`
export const LOGIN_PATH = '/login'
export const CONTACT_US_PATH = '/contact-us'
export const SIGN_UP_PATH = '/signup'
export const SUBSCRIPTION_PATH = '/subscription'
export const CHECKOUT_PATH = '/checkout'
export const PRIVACY_PATH = '/privacy'
export const TERMS_OF_SERVICE_PATH = '/terms-of-service'
export const TEST_PATH = '/tests'
export const ARTICLE_HOMEPAGE_PATH = '/articles-home'
export const DICTIONARY_PATH = '/dictionary'
export const FORGOT_PASSWORD_PATH = '/forgot-password'
export const IMMERSION_LEVEL_INFO_PATH = '/immersion-level-info'
export const SETTINGS_PATH = '/settings'
export const RESET_PASSWORD_PATH = '/reset-password'
export const ARTICLE_PATH = (forLesson: boolean, language?: string, slug?: string) => {
  const base = forLesson ? '/lesson-article' : '/articles'
  return `${base}/${language != null ? language : ':language'}/${slug != null ? slug : ':slug'}`
}
export const LIST_OF_EXERCISES_PATHS = {
  WRITING_SHEETS: '/writing-sheets',
  NUMBER_DRILLS: '/number-drills',
  WRITING_CANVAS: '/writing-canvas'
}
