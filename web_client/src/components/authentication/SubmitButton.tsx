import './SubmitButton.scss'
import ClipLoader from 'react-spinners/ClipLoader'
import React from 'react'

interface SubmitButtonProps {
  /**
     * Text to display on button
     */
  text: string
  onClick: () => void
  dataHasFinishedProcessing: boolean
}

/**
 * Handles sending the user information to the server
 * from the login/sign up page
 */
export const SubmitButton = ({
  text,
  onClick,
  dataHasFinishedProcessing
}: SubmitButtonProps): JSX.Element => {
  return (
        <div className='authentication-submit-button' onClick={onClick}>
            {
                dataHasFinishedProcessing
                  ? <span>{text}</span>
                  : <ClipLoader color='white' loading={true} size={13} />
            }
        </div>
  )
}
