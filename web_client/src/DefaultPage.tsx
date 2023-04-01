import { useEffect } from 'react'
import { useAppSelector } from './app/hooks'
import { useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import axios from 'axios'
import { HOME_PATH } from './paths'

const isInDevelopmentEnv = process.env.NODE_ENV == null || process.env.NODE_ENV === 'development'
const verifyTokenPath = 'api/token/verify/'

export const DefaultPage = (): JSX.Element => {
  const { access, refresh } = useAppSelector(state => state.token)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isInDevelopmentEnv) {
      axios.post(verifyTokenPath, { token: access })
        .then(_res => {
          navigate(HOME_PATH)
        })
        .catch(_err => {
          axios.post(verifyTokenPath, { token: refresh })
            .then(_res => {
              navigate(HOME_PATH)
            })
            .catch(_err => {
              navigate('/login')
            })
        })
    }
  }, [access, navigate, refresh])

  return (
        <div style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '30px',
          height: '70vh',
          justifyContent: 'center',
          width: '100%'
        }}>
            <div>Loading...</div>
            <ClipLoader />
        </div>
  )
}
