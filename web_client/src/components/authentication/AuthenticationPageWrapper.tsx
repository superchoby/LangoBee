import ClipLoader from 'react-spinners/ClipLoader'
import Logo from '../../images/Logo.png'
import { SyntheticEvent } from 'react'
import './AuthenticationPageWrapper.scss'
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { useEffect, useState } from 'react';

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
  onSuccessfulSocialAuthLogin?(token: string, auth_provider: "google-oauth2" | 'facebook'): void
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
  onSuccessfulSocialAuthLogin
}: AuthenticationPageWrapperProps) => {
  const [socialAuthFail, changeSocialAuthFail] = useState(false)
  const handleOnSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit()
  }

  // useEffect(() => {
  //   navigate(LOGIN_PATH)
  // }, [])

  // const login = useGoogleLogin({
  //   onSuccess: onSuccessfulSocialAuthLogin != null ? (codeResponse) => onSuccessfulSocialAuthLogin(codeResponse.access_token, 'google-oauth2') : () => {},
  //   onError: (error) => changeSocialAuthFail(true)
  // });

  return (
        <div className='authentication-page-wrapper'>
            <img className='authentication-page-logo' src={Logo} alt="LangoBee Logo" />
            <h2>{title}</h2>
            <p className='authentication-page-message'>{message}</p>
            {/* <button onClick={() => login()}>google</button> */}
            {/* {onSuccessfulSocialAuthLogin != null && (
              <div className='authentication-page-social-auth-buttons-container'>
                <button className="social-auth-button social-auth-button-google" onClick={() => login()}>
                  <img 
                    alt="Google sign-in" 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" 
                  />
                  Sign up with Google
                </button>
                <FacebookLogin
                  className="social-auth-button social-auth-button-facebook"
                  appId={process.env.REACT_APP_SOCIAL_AUTH_FACEBOOK_KEY!}
                  onSuccess={(response) => {
                    console.log(response)
                    onSuccessfulSocialAuthLogin(response.accessToken, 'facebook')
                  }}
                  onFail={() => {
                    changeSocialAuthFail(true)
                  }}
                >
                  <img alt="Google sign-in" 
                      src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg" />
                  Sign up with Facebook
                </FacebookLogin>
              </div>
            )} */}
            
            <p className='social-auth-and-normal-auth-divider'>or</p>
            
            {/* <button>
              <img src={GoogleLogo} alt='Google Logo' /> 
              Sign in with Google
            </button> */}
            {/* <div className="g-signin2" data-width="300" data-height="200" data-longtitle="true" /> */}
            {/* {socialAuthHandlers != null && (
              <GoogleLogin
                onSuccess={credentialResponse => {
                  console.log(credentialResponse)
                  
                  console.log('after login')
                  axios.post('api/social_login/social/jwt-pair/', {provider: 'google', code: credentialResponse.credential})
                  .then(res => {
                    console.log(res)
                    
                    socialAuthHandlers.onSuccess()
                    
                  })
                  .catch(err => {
                    console.error(err)
                    socialAuthHandlers.onFail()
                  })
                }}
                onError={() => {
                  socialAuthHandlers.onFail()
                }}
              />
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
