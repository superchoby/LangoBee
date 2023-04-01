import React from 'react'
import './formcontainer.scss'

interface FormContainerProps {
  /**
     * The class indicating which styles to apply to the container
     */
  containerClass: 'login-form-container' | 'signup-form-container' | 'forgot-password-form-container' | 'reset-password-form-container'
  name: string
  children: JSX.Element
  onSubmit: () => void
}

/**
 * Wrapper element for the signup and login forms
 */
export const FormContainer = ({
  name,
  containerClass,
  children,
  onSubmit
}: FormContainerProps): JSX.Element => {
  return (
        <form
            aria-label={name}
            name={name}
            className={`authentication-form-container ${containerClass}`}
            onSubmit={onSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter') onSubmit() }}
        >
            {children}
        </form>
  )
}
