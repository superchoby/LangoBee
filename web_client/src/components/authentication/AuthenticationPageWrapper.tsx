import ClipLoader from 'react-spinners/ClipLoader'
import Logo from '../../images/Logo.png'
import { SyntheticEvent } from 'react'
import './AuthenticationPageWrapper.scss'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios'

interface AuthenticationPageWrapperProps {
  title: string
  message: string
  buttonText: string
  onSubmit: () => void
  alternativeLinks: JSX.Element
  inputs: JSX.Element[]
  formName: string
  authenticationInfoIsBeingSent: boolean
  authenticationProcessErrorMessage: string
  infoHasBeenSubmitted?: boolean
  contentToShowAfterSubmit?: JSX.Element
  handleSocialAuth?(access: string, refresh: string): void
}

export const AuthenticationPageWrapper = ({
  title,
  message,
  buttonText,
  onSubmit,
  alternativeLinks,
  inputs,
  formName,
  authenticationInfoIsBeingSent,
  authenticationProcessErrorMessage,
  infoHasBeenSubmitted,
  contentToShowAfterSubmit,
  handleSocialAuth
}: AuthenticationPageWrapperProps) => {
  const handleOnSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
        <div className='authentication-page-wrapper'>
            <img src={Logo} alt="LangoBee Logo" />
            <h2>{title}</h2>
            {handleSocialAuth != null && (
              <GoogleLogin
                useOneTap={false}
                text='signup_with'
                onSuccess={credentialResponse => {
                  console.log(credentialResponse)
                  axios.post('social-login/google/', {
                    access_token: credentialResponse.credential
                  })
                  .then(res => {
                    console.log(res)
                    handleSocialAuth(res.data.access, res.data.refresh)
                  })
                  .catch(err => {
                    console.error(err)
                  })
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            )}
            <p className='authentication-page-message'>{message}</p>
            {infoHasBeenSubmitted && contentToShowAfterSubmit != null
              ? contentToShowAfterSubmit
              : (
                <form
                    aria-label={formName}
                    name={formName}
                    className={'authentication-form-container'}
                    onSubmit={handleOnSubmit}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleOnSubmit(e) }}
                >
                    <div className='authentication-error-msg'>{authenticationProcessErrorMessage}</div>
                    <div className='authentication-page-wrapper-inputs-container'>
                        {inputs}
                    </div>
                    <button className='authentication-submit-button' onClick={handleOnSubmit}>
                        {
                          authenticationInfoIsBeingSent
                            ? <ClipLoader color='white' loading={true} size={13} />
                            : <span>{buttonText}</span>
                        }
                    </button>
                </form>
                )}
            <div className='authentication-page-wrapper-alternative-links-container'>{alternativeLinks}</div>
        </div>
  )
}
