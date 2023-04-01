import './ForwardBackButton.scss'
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'
import React from 'react'

interface ForwardBackButtonProps {
  /**
     * Function to either go to next or previous card
     */
  onClick: () => void
  /**
     * Whether or not the button is a next or previous button
     */
  isForwardButton: boolean
  /**
     * Whether or not to display the button, for ex if viewing
     * the very first card, you wouldn't show the prev button
     */
  display: boolean
}

/**
 * Button that faces either forward or backward and brings
 * user to either the next or previous concept
 */
export const ForwardBackButton = ({
  onClick,
  isForwardButton,
  display
}: ForwardBackButtonProps): JSX.Element => {
  return (
        <div
            aria-label={isForwardButton ? 'Forward Button' : 'Back Button'}
            onClick={() => { if (display) onClick() }}
            className={`forward-back-button-container ${isForwardButton ? 'learning-forward-button' : 'learning-backward-button'}`}
            style={{ visibility: display ? 'visible' : 'hidden' }}
        >
            {
                isForwardButton
                  ? <MdArrowForwardIos className='forward-or-back-button' size={25} />
                  : <MdArrowBackIos className='forward-or-back-button' size={25} />
            }
        </div>
  )
}
