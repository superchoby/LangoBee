export const isInDevelopmentEnv = process.env.NODE_ENV == null || process.env.NODE_ENV === 'development'
export const PROD_URL = 'https://www.langobee.com/'
export const BASE_URL = isInDevelopmentEnv ? 'http://127.0.0.1:8000/' : 'https://langobee-server.herokuapp.com/'