import { useState, useEffect } from 'react'
import { AuthenticationInput } from './AuthenticationInput'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './ForgotPassword.scss'
import { AuthenticationPageWrapper } from './AuthenticationPageWrapper'
import { LOGIN_PATH } from 'src/paths'

function ValidateEmail (email: string): boolean {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return (true)
  }
  return (false)
}

const ENTER_EMAIL_FOR_LINK_MSG = 'Enter in your email to get a link to reset your password'
const EMAIL_HAS_BEEN_SENT_MSG = "An email with the link has been sent!"
const emailHasBeenSendAgainMessage = (count: number) => (
  `An email has been sent again (${count})`
)

export const ForgotPassword = (): JSX.Element => {
  const [email, changeEmail] = useState('')
  // const [emailNotValid, changeEmailNotValid] = useState(false)
  const [currentlyMakingForgotPasswordRequest, changeCurrentlyMakingForgotPasswordRequest] = useState(false)
  const [errorMsg, changeErrorMsg] = useState('')
  const [timesSentEmail, changeTimesSentEmail] = useState(0)
  const [pageMessage, changePageMessage] = useState(ENTER_EMAIL_FOR_LINK_MSG)

  useEffect(() => {
    changeEmail('')
    // changeEmailNotValid(false)
    changeCurrentlyMakingForgotPasswordRequest(false)
    changeErrorMsg('')
    changeTimesSentEmail(0)
  }, [])

  useEffect(() => {
    if (timesSentEmail === 0) {
      changePageMessage(ENTER_EMAIL_FOR_LINK_MSG)
    } else if (timesSentEmail === 1) {
      changePageMessage(EMAIL_HAS_BEEN_SENT_MSG)
    } else {
      changePageMessage(emailHasBeenSendAgainMessage(timesSentEmail))
    }
  }, [timesSentEmail])

  const SendResetPasswordEmail = (): void => {
    if (ValidateEmail(email)) {
      // changeEmailNotValid(false)
      changeCurrentlyMakingForgotPasswordRequest(true)
      axios.post('api/password_reset/', {
        email
      })
        .then(_res => {
          changeCurrentlyMakingForgotPasswordRequest(false)
          changeTimesSentEmail(timesSentEmail + 1)
        })
        .catch(_err => {
          changeCurrentlyMakingForgotPasswordRequest(false)
          changeErrorMsg('Sorry but we are currently facing technical issues, please try again later')
          // changeEmailNotValid(true)
        })
    } else {
      // changeEmailNotValid(true)
      changeErrorMsg('Please enter a valid email')
    }
  }

  return (
    <AuthenticationPageWrapper 
        title='FORGOT PASSWORD'
        message={pageMessage}
        buttonText={timesSentEmail > 0 ? 'RESEND' : 'SEND EMAIL'}
        onSubmit={SendResetPasswordEmail}
        authenticationProcessErrorMessage={errorMsg}
        alternativeLinks={
          <div>
              Remember your password? <Link to={LOGIN_PATH}>Log in</Link>
          </div>
        }
        inputs={[
          <AuthenticationInput
              id='forgot-pass-email-input'
              label='Email'
              placeholder='Email'
              type='text'
              value={email}
              changeValue={changeEmail}
          />
        ]}
        formName='login-form'
        infoHasBeenSubmitted={timesSentEmail > 0}
        contentToShowAfterSubmit={
          <div className='reset-password-email-sent-msg'>
            If you don't receive it within a few minutes, 
            <button onClick={SendResetPasswordEmail} className='resend-forgot-pass-button'>resend</button> 
            the email. Be sure to check your spam as well
          </div>
        }
        authenticationInfoIsBeingSent={currentlyMakingForgotPasswordRequest}
      />
  )
}
