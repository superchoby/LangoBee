import { useState } from 'react'
import { AuthenticationInput } from './AuthenticationInput'
import { Link, useNavigate } from 'react-router-dom'
import './login.scss'
import axios from 'axios'
import { updateToken } from '../../app/tokenSlice'
import { useAppDispatch } from '../../app/hooks'
import { HOME_PATH } from 'src/paths'
import { AuthenticationPageWrapper } from './AuthenticationPageWrapper'

const isInDevelopmentEnv = process.env.NODE_ENV == null || process.env.NODE_ENV === 'development'

/**
 * Page for user to login to the app
 */
export const Login = (): JSX.Element => {
  const [emailOrUsername, changeEmailOrUsername] = useState('')
  const [password, changePassword] = useState('')
  const [errorMessage, changeErrorMessage] = useState('')
  const [loginInfoIsBeingSent, changeLoginInfoIsBeingSent] = useState(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const loginUser = (): void => {
    changeLoginInfoIsBeingSent(true)
    axios.post('api/token/', {
      username: emailOrUsername.toLowerCase(),
      password
    })
      .then(res => {
        changeLoginInfoIsBeingSent(false)
        changeErrorMessage('')
        const {
          access,
          refresh
        } = res.data
        dispatch(updateToken({
          access,
          refresh
        }))
        navigate(HOME_PATH)
      })
      .catch(err => {
        changeLoginInfoIsBeingSent(false)
        const { response } = err
        if (typeof response !== 'undefined' && response.status === 401) {
          changeErrorMessage('An account with the given username and/or password could not be found')
        } else {
          changeErrorMessage('Sorry we are currently facing technical issues, please try again later.')
        }
      })
  }

  return (
      <AuthenticationPageWrapper
        title='LOGIN'
        message='Glad to see you again!'
        buttonText='LOGIN'
        onSubmit={loginUser}
        authenticationProcessErrorMessage={errorMessage}
        alternativeLinks={
          <>
            <div>
              <span>Don&apos;t have an account? <Link to='/signup'>Sign up</Link></span>
              <Link to='' onClick={() => {
                window.location.href = isInDevelopmentEnv ? 'http://localhost:3000' : 'https://www.LangoBee.com'
              }} />
            </div>
            <div>
              <span>Forgot your password? <Link to='/forgot_password'>Click here</Link></span>
              <Link to='' onClick={() => {
                window.location.href = isInDevelopmentEnv ? 'http://localhost:3001' : 'https://LangoBee.com'
              }} />
            </div>
          </>
        }
        inputs={[
          <AuthenticationInput
              id='login-username-or-email-input'
              label='Username or Email'
              placeholder='Username or email'
              type='text'
              value={emailOrUsername}
              changeValue={changeEmailOrUsername}
              key='username or email'
          />,
          <AuthenticationInput
              id='login-password-input'
              label='Password'
              placeholder='Password'
              type='password'
              value={password}
              changeValue={changePassword}
              key='password'
          />
        ]}
        formName='login-form'
        authenticationInfoIsBeingSent={loginInfoIsBeingSent}
      />
  )
}
