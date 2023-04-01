import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { AuthenticationInput } from './AuthenticationInput'
import './ResetPassword.scss'
import { AuthenticationPageWrapper } from './AuthenticationPageWrapper'

export const ResetPassword = (): JSX.Element => {
  const [resetTokenIsValid, changeResetTokenIsValid] = useState(true)
  const [newPassword, changeNewPassword] = useState('')
  const [confirmNewPassword, changeConfirmNewPassword] = useState('')
  const [emailIsBeingSent, changeEmailIsBeingSent] = useState(false)
  const [passwordHasBeenChanged, changePasswordHasBeenChanged] = useState(false)
  const [errorHasOccurred, changeErrorHasOccurred] = useState(false)
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
      changeErrorHasOccurred(false)
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
          changeErrorHasOccurred(true)
          try {
            changeErrorMsg(err.response.data.password[0])
          } catch (error) {
            changeErrorMsg('Sorry we are currently facing technical issues, please try again later')
          }
        })
    } else {
      changeErrorHasOccurred(true)
      changeErrorMsg(newPassword.length < 8 ? 'The password must be at least 8 characters' : 'The passwords must match')
    }
  }

  return resetTokenIsValid ? (
    <AuthenticationPageWrapper 
        title='CHANGE PASSWORD'
        message={passwordHasBeenChanged ? 'Successfully changed password!' : 'Enter your new password'}
        buttonText='CHANGE PASSWORD'
        onSubmit={changePassword}
        authenticationProcessErrorMessage={errorMsg}
        alternativeLinks={
          <div>
              Remember your password? <Link to='/login'>Log In</Link>
          </div>
        }
        infoHasBeenSubmitted={passwordHasBeenChanged}
        contentToShowAfterSubmit={
          <div className='default-reset-password-container'>
              <span>Return to <Link to='/login'>Log In</Link></span>
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
          />,
          <AuthenticationInput
              id='reset-password-confirm-new-pass-input'
              label='Confirm New Password'
              placeholder='Confirm New Password'
              type='password'
              value={confirmNewPassword}
              changeValue={changeConfirmNewPassword}
          />
        ]}
        formName='login-form'
        authenticationInfoIsBeingSent={emailIsBeingSent}
      /> ) : (
        <div className='default-reset-password-container'>
            <span>
                Your token is no longer valid, please go back and
                <Link to='/forgot_password'> request a new password</Link>
            </span>
        </div>
      )
}
