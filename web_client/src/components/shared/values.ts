export const AUDIO_FILE_BASE_URL = 'http://d1ymdibvv3e2ww.cloudfront.net/audio/'
export const CLOUDFRONT_BASE_URL = 'http://d1ymdibvv3e2ww.cloudfront.net/'
export const LIFETIME_SUBSCRIPTION = 'Lifetime'
export const ANNUAL_SUBSCRIPTION = 'Annual'
export const MONTHLY_SUBSCRIPTION = 'Monthly'
export const FREE_TRIAL = 'Free Trial'
export type SUBSCRIPTION_TYPE = typeof LIFETIME_SUBSCRIPTION | typeof ANNUAL_SUBSCRIPTION | typeof MONTHLY_SUBSCRIPTION
export const FETCHED_DATA_SUCCESS = 'fetched success'
export const FETCHED_DATA_ERROR = 'fetched error'
export const FETHCED_DATA_PROCESSING = 'fetch processing'
export type FETCH_TYPE = typeof FETCHED_DATA_SUCCESS | typeof FETCHED_DATA_ERROR | typeof FETHCED_DATA_PROCESSING
export const IS_IN_DEV_MODE = process.env.NODE_ENV == null || process.env.NODE_ENV === 'development'