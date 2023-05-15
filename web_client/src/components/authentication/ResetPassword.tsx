import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { AuthenticationInput } from './AuthenticationInput'
import './ResetPassword.scss'
import { AuthenticationPageWrapper } from './AuthenticationPageWrapper'
import { LOGIN_PATH, FORGOT_PASSWORD_PATH } from 'src/paths'

export const ResetPassword = (): JSX.Element => {
  const [resetTokenIsValid, changeResetTokenIsValid] = useState(true)
  const [newPassword, changeNewPassword] = useState('')
  const [confirmNewPassword, changeConfirmNewPassword] = useState('')
  const [emailIsBeingSent, changeEmailIsBeingSent] = useState(false)
  const [passwordHasBeenChanged, changePasswordHasBeenChanged] = useState(false)
  const [errorMsg, changeErrorMsg] = useState('')
  const { reset_token: resetToken } = useParams()

  useEffect(() => {
    axios.post('api/password_reset/validate_token/', {
      token: resetToken
    })
      .then(_res => {
        changeResetTokenIsValid(true)
      })
      .catch(_err => {
        changeResetTokenIsValid(false)
      })
  }, [resetToken])

  const changePassword = (): void => {
    if (newPassword === confirmNewPassword && newPassword.length >= 8) {
      changeEmailIsBeingSent(true)
      axios.post('api/password_reset/confirm/', {
        token: resetToken,
        password: newPassword
      })
        .then(_res => {
          changeEmailIsBeingSent(false)
          changePasswordHasBeenChanged(true)
        })
        .catch(err => {
          changeEmailIsBeingSent(false)
          try {
            changeErrorMsg(err.response.data.password[0])
          } catch (error) {
            changeErrorMsg('Sorry we are currently facing technical issues, please try again later')
          }
        })
    } else {
      changeErrorMsg(newPassword.length < 8 ? 'The password must be at least 8 characters' : 'The passwords must match')
    }
  }

  return resetTokenIsValid
    ? (
    <AuthenticationPageWrapper
        title='CHANGE PASSWORD'
        message={passwordHasBeenChanged ? 'Successfully changed password!' : 'Enter your new password'}
        buttonText='CHANGE PASSWORD'
        onSubmit={changePassword}
        authenticationProcessErrorMessage={errorMsg}
        alternativeLinks={
          passwordHasBeenChanged ? (
            <></>
          ) : (
            <div>
              Remember your password? <Link to={LOGIN_PATH}>Log in</Link>
            </div>
          )
        }
        infoHasBeenSubmitted={passwordHasBeenChanged}
        contentToShowAfterSubmit={
          <div className='default-reset-password-container'>
              <span>Return to <Link to={LOGIN_PATH}>Log in</Link></span>
          </div>
        }
        inputs={[
          <AuthenticationInput
              id='reset-password-new-pass-input'
              label='New Password'
              placeholder='New Password'
              type='password'
              value={newPassword}
              changeValue={changeNewPassword}
              key='new password'
          />,
          <AuthenticationInput
              id='reset-password-confirm-new-pass-input'
              label='Confirm New Password'
              placeholder='Confirm New Password'
              type='password'
              value={confirmNewPassword}
              changeValue={changeConfirmNewPassword}
              key='confirm new password'
          />
        ]}
        formName='login-form'
        authenticationInfoIsBeingSent={emailIsBeingSent}
      />)
    : (
        <div className='default-reset-password-container'>
            <span>
                Your token is no longer valid, please go back and
                <Link to={FORGOT_PASSWORD_PATH}> request a new password</Link>
            </span>
        </div>
      )
}
