import { useState } from 'react'
import { AuthenticationInput } from './AuthenticationInput'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { updateToken } from '../../app/tokenSlice'
import { useAppDispatch } from '../../app/hooks'
import { LESSONS_PATH, SUBSCRIPTION_PATH } from 'src/paths'
import { AuthenticationPageWrapper } from './AuthenticationPageWrapper'

function ValidateEmail (email: string): boolean {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return (true)
  }
  return (false)
}

const isInDevelopmentEnv = process.env.NODE_ENV == null || process.env.NODE_ENV === 'development'

/**
 * Page for user to signup for an account
 */
export const Signup = (): JSX.Element => {
  const [username, changeUsername] = useState('')
  const [email, changeEmail] = useState('')
  const [password, changePassword] = useState('')
  const [confirmPassword, changeConfirmPassword] = useState('')
  const [usernameError, changeUsernameError] = useState('')
  const [emailError, changeEmailError] = useState('')
  const [passwordError, changePasswordError] = useState('')
  const [confirmPasswordError, changeConfirmPasswordError] = useState('')
  const [signUpError, changeSignUpError] = useState('')
  const [signUpLoading, changeSignUpLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const signUpUser = (): void => {
    let noErrors = true

    if (username.length === 0) {
      changeUsernameError('The username you entered was invalid')
      noErrors = false
    } else {
      changeUsernameError('')
    }

    if (!ValidateEmail(email)) {
      changeEmailError('The email you entered was invalid')
      noErrors = false
    } else {
      changeEmailError('')
    }

    if (password.length === 0) {
      changePasswordError('The password you entered was invalid')
      noErrors = false
    } else {
      changePasswordError('')
    }

    if (password !== confirmPassword) {
      changeConfirmPasswordError('The passwords do not match')
      noErrors = false
    } else {
      changeConfirmPasswordError('')
    }

    if (noErrors) {
      changeSignUpLoading(true)
      changeSignUpError('')
      axios.post('users/sign-up/', {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password
      })
        .then(res => {
          changeSignUpLoading(false)
          const {
            access,
            refresh
          } = res.data
          dispatch(updateToken({
            access,
            refresh
          }))
          navigate({
            pathname: searchParams.get('take_to_subscription_page') === 'true' ? 
              SUBSCRIPTION_PATH :
              LESSONS_PATH
            ,
            search: '?just_joined=true',
          })
        })
        .catch(err => {
          changeSignUpLoading(false)
          if (err.response != null && Object.keys(err.response).includes('data')) {
            if (Object.keys(err.response.data).includes('username') && err.response.data.username.includes('A user with that username already exists.') as boolean) {
              changeUsernameError('This username has been taken')
            } else if (Object.keys(err.response.data).includes('email') && err.response.data.email.includes('user with this email already exists.') as boolean) {
              changeEmailError('This email has been taken')
            }
          } else {
            changeSignUpError('Sorry we are currently facing technical issues, please try again later.')
          }
        })
    }
  }

  return (
      <AuthenticationPageWrapper
          title='SIGN UP'
          message='Looking forward to having you join us!'
          buttonText='SIGN UP'
          onSubmit={signUpUser}
          authenticationProcessErrorMessage={signUpError}
          socialAuthHandlers={{
            onSuccess: () => {

            },
            onFail: () => {

            }
          }}
          alternativeLinks={
            <>
              <span>Already have an account? <Link to='/login'>Log In</Link></span>
              <Link to='' onClick={() => {
                window.location.href = isInDevelopmentEnv ? 'http://localhost:3001' : 'https://LangoBee.com'
              }} />
            </>
          }
          inputs={[
            <AuthenticationInput
                id='signup-username-input'
                label='Username'
                placeholder='Username'
                type='text'
                value={username}
                changeValue={changeUsername}
                errorMessage={usernameError}
                key='username'
            />,
            <AuthenticationInput
                id='signup-email-input'
                label='Email'
                placeholder='Email'
                type='email'
                value={email}
                changeValue={changeEmail}
                errorMessage={emailError}
                key='email'
            />,
            <AuthenticationInput
                id='signup-password-input'
                label='Password'
                placeholder='Password'
                type='password'
                value={password}
                changeValue={changePassword}
                errorMessage={passwordError}
                key='password'
            />,
            <AuthenticationInput
                id='signup-confirm-password-input'
                label='Confirm Password'
                placeholder='Reenter Password'
                type='password'
                value={confirmPassword}
                errorMessage={confirmPasswordError}
                changeValue={changeConfirmPassword}
                key='confirm password'
            />
          ]}
          formName='login-form'
          authenticationInfoIsBeingSent={signUpLoading}
        />
  )
}
