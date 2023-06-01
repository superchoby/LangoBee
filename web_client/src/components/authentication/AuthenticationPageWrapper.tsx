import ClipLoader from 'react-spinners/ClipLoader'
import Logo from '../../images/Logo.png'
import { SyntheticEvent } from 'react'
import './AuthenticationPageWrapper.scss'
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios'
// import FacebookLogin from 'react-facebook-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { ImFacebook } from 'react-icons/im'
import { updateToken } from '../../app/tokenSlice'
import { useAppDispatch } from '../../app/hooks'
import { useNavigate, To } from 'react-router-dom'
import { IS_IN_DEV_MODE } from '../shared/values';
import FacebookLogin from '@greatsumini/react-facebook-login';

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
  redirectAfterSocialLogin?: To
}

const userAlreadyRegisteredMsg = 'User is already registered with this e-mail address.'
const emailExistsInAnotherAuthMethod = 'An account with this email already exists with another sign in method'
const generalSocialAuthError = 'Sorry, there was an error signing you in. Please try again later.'

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
  redirectAfterSocialLogin
}: AuthenticationPageWrapperProps) => {
  const [errorWithAuthentication, changeErrorWithAuthentication] = useState<'none' | typeof emailExistsInAnotherAuthMethod | typeof generalSocialAuthError>('none')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleOnSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const updateTokensAndNavigate = (access: string, refresh: string) => {
    dispatch(updateToken({
      access,
      refresh
    }))
    if (redirectAfterSocialLogin != null) {
      navigate(redirectAfterSocialLogin)
    }
  }

  const socialLogin = (socialLoginProvider: 'google' | 'facebook', accessToken: string) => {
    axios.post(`social-login/${socialLoginProvider}/`, { access_token: accessToken })
    .then(res => {
      updateTokensAndNavigate(res.data.access, res.data.refresh)
    })
    .catch(err => {
      try {
        if (err.response.data.non_field_errors[0] === userAlreadyRegisteredMsg) {
          changeErrorWithAuthentication(emailExistsInAnotherAuthMethod)
        } else {
          changeErrorWithAuthentication(generalSocialAuthError)
        }
      } catch {
        changeErrorWithAuthentication(generalSocialAuthError)
      }
    })
  }

  return (
        <div className='authentication-page-wrapper'>
            <img src={Logo} alt="LangoBee Logo" />
            <h2>{title}</h2>
            <p className='authentication-page-message'>{message}</p>
            {/* {redirectAfterSocialLogin != null && (
              <>
                <p style={{color: 'red'}}>{errorWithAuthentication !== 'none' && errorWithAuthentication}</p>
                <div>
                  <GoogleLogin 
                    auto_select={false}
                    width='306' 
                    logo_alignment='left'
                    onSuccess={({credential}) => socialLogin('google', credential ?? '')} 
                    size='large'
                  />
                  <FacebookLogin
                    appId={IS_IN_DEV_MODE ? '1305860207015809' : '1034736184550272'}
                    autoLoad={false}
                    fields="name,email,picture"
                    onSuccess={(res: any) => socialLogin('facebook', res.accessToken ?? '')}
                    // callback={(res: any) => socialLogin('facebook', res.accessToken ?? '')}
                    // icon="fa-facebook"
                    render={renderProps => {
                        return (
                          <button onClick={renderProps.onClick} className='social-login-button facebook-social-login-button'>
                            <ImFacebook />
                            <div className='facebook-social-login-button-text'>
                              Sign in with Facebook
                            </div>
                          </button>
                        )
                    }}
                  />
                </div>
                <div className='authentication-page-wrapper-or-line-container'>
                  <p className='authentication-page-wrapper-or-line'>
                    <span className='authentication-page-wrapper-or-text'>OR</span>
                  </p>
                </div>
              </>
            )} */}
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
