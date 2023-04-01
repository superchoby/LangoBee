import { Link } from 'react-router-dom'
import { HOME_PATH } from 'src/paths'

interface QuizStatusMessageProps {
  isSuccess: boolean
  showMsg: boolean
  completionMessage: string
  finishedButtonText: string
  onDoneClick(): void
}

export const QuizStatusMessage = ({
  isSuccess,
  showMsg,
  completionMessage,
  finishedButtonText,
  onDoneClick
}: QuizStatusMessageProps): JSX.Element => {
  return (
        <div className={`
            finished-quiz-msg 
            ${showMsg ? 'finished-quiz-msg-revealed' : ''} 
            ${isSuccess ? 'finished-quiz-msg-success' : 'finished-quiz-msg-error'}
        `}>
            <div className='finished-quiz-msg-text-portion'>
                <div className='congrats-for-finishing-quiz-msg'>
                    { isSuccess ? 'Congratulations' : 'Oops'}!
                </div>
                <div className='passed-quiz-exp-msg'>
                    {
                        isSuccess
                          ? completionMessage
                          : 'Sorry, we are currently facing technical difficulties, please try again later.'
                    }
                </div>
            </div>

            <div
                className='finished-quiz-buttons-container'
                style={{ justifyContent: 'center' }}
            >
                <Link to={HOME_PATH} onClick={onDoneClick}>
                    <div className='go-home-button'>{finishedButtonText}</div>
                </Link>
            </div>
        </div>
  )
}
