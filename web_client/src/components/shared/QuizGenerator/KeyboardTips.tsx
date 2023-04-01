import React from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
// import Modal from 'react-modal'
import './KeyboardTips.scss'

interface showKeyboardTipsProps {
  changeShowKeyboardTips: (showKeyboardTips: boolean) => void
}

export const KeyboardTips = ({
  changeShowKeyboardTips
}: showKeyboardTipsProps): JSX.Element => {
  const modalStyle = {
    content: {
      backgroundColor: '#f5f5f6',
      color: '#4d5054',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  return (
    <></>
        // <Modal
        //     ariaHideApp={false}
        //     isOpen={true}
        //     style={modalStyle}
        //     contentLabel="Keyboard Tips"
        // >
        //     <AiFillCloseCircle
        //         className='keyboard-tips-modal-close-icon'
        //         onClick={() => changeShowKeyboardTips(false)}
        //     />
        //     <ul className='keyboard-tips-list'>
        //         <li>Your English input is phonetically converted to Japanese</li>
        //         <li>Press shift to switch between Hiragana and Katakana</li>
        //         <li>To enter small ゃ, ゅ, ょ type the corresponding romaji e.g. kya -&#62; きゃ</li>
        //         <li>To enter small っ enter a consonant twice e.g. kitte -&#62; きって</li>
        //         <li>To enter all other small characters, type an x before it, e.g. xA -&#62; ァ</li>
        //     </ul>
        // </Modal>
  )
}
