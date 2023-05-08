import './AuthenticationInput.scss'

export interface AuthenticationInputProps {
  id: string
  label: string
  /**
     * placeholder to indicate what the user should input
     */
  placeholder: string
  /**
     * Type of input
     */
  type: 'email' | 'text' | 'password'
  value: string
  changeValue: (newValue: string) => void
  errorMessage?: string
}

/**
 * The input component used for the login and signup forms
 */
export const AuthenticationInput = ({
  id,
  label,
  placeholder,
  type,
  value,
  changeValue,
  errorMessage
}: AuthenticationInputProps): JSX.Element => {
  return (
        <>
            <span className='authentication-error-msg'>{errorMessage}</span>
            <input
                className='authentication-input'
                id={id}
                data-testid="authentication-input"
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={({ target: { value } }) => { changeValue(value) }}
            />
        </>
  )
}
