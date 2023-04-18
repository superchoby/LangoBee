export const HOME_PATH = '/home'
export const STORIES_HOME_PATH = '/stories'
export const READ_STORY = '/stories/:language/:slug'
export const EXERCISES_PATH = '/exercises'
export const PROFILE_PATH = '/profile'
export const STATISTICS_PATH = '/statistics'
export const REVIEWS_PATH = '/reviews'
export const LESSONS_PATH = '/lessons'
export const REVIEWS_INFO_PATH = '/reviews_info'
export const LESSONS_SESSION_PATH = `${LESSONS_PATH}/session`
export const LOGIN_PATH = '/login'
export const ARTICLE_PATH = (forLesson: boolean, language?: string, slug?: string) => {
    const base = forLesson ? '/lesson_article' : '/articles'
    return `${base}/${language != null ? language : ':language'}/${slug != null ? slug : ':slug'}`
}
export const LIST_OF_EXERCISES_PATHS = {
    WRITING_SHEETS: '/writing_sheets',
    NUMBER_DRILLS: '/number_drills',
    WRITING_CANVAS: '/writing_canvas'
}