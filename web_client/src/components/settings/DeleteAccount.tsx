import { useState } from 'react'
import axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'
import './DeleteAccount.scss'
import { useNavigate } from 'react-router-dom'
import { LOGIN_PATH } from 'src/paths'

const PERMANENTLY_DELETE_CONFIRMATION = 'Permanently Delete'

export const DeleteAccount = () => {
  const [userWantsToDeleteAccount, changeUserWantsToDeleteAccount] = useState(false)
  const [accountDeleteConfirmationMessage, changeAccountDeleteConfirmationMessage] = useState('')
  const [processingDeletion, changeProcessingDeletion] = useState(false)
  const [successfullyDeleted, changeSuccessfullyDeleted] = useState(false)
  const [errorDeleting, changeErrorDeleting] = useState(false)

  const navigate = useNavigate()

  const userConfirmedDeletion = PERMANENTLY_DELETE_CONFIRMATION.toLowerCase() === accountDeleteConfirmationMessage.toLowerCase()

  const deleteAccount = () => {
    if (userConfirmedDeletion) {
      changeProcessingDeletion(true)
      axios.get('users/delete')
        .then(res => {
          changeSuccessfullyDeleted(true)
          changeProcessingDeletion(false)
          changeErrorDeleting(true)
          setTimeout(() => {
            navigate(LOGIN_PATH)
          }, 3000)
        })
        .catch(err => {
          console.error(err)
          changeProcessingDeletion(false)
          changeErrorDeleting(true)
        })
    }
  }

  return userWantsToDeleteAccount
    ? (
            <div className={`delete-account-confirmation-container ${successfullyDeleted ? 'delete-account-success' : ''}`}>
                {(successfullyDeleted || errorDeleting)
                  ? (
                    <>
                        {successfullyDeleted ? 'Deletion Successful, you will be logged out soon' : 'Sorry, there was an error with deleting your account, please try again later'}
                    </>
                    )
                  : (
                    <>
                        <p>Are you sure? To delete your account type <span className='delete-account-permanently-delete-msg'>Permanently Delete</span> below.</p>
                            <input
                                type='text'
                                className='delete-account-input'
                                value={accountDeleteConfirmationMessage}
                                onChange={e => { changeAccountDeleteConfirmationMessage(e.target.value) }}
                            />
                            <div>
                                <button
                                    className='delete-account-button'
                                    onClick={() => {
                                      changeUserWantsToDeleteAccount(false)
                                      changeAccountDeleteConfirmationMessage('')
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`delete-account-button ${userConfirmedDeletion ? 'delete-account-button-confirm' : ''}`}
                                    onClick={deleteAccount}
                                >
                                    {processingDeletion
                                      ? (
                                        <>Deleting <ClipLoader size={12} /></>
                                        )
                                      : (
                                          'Confirm'
                                        )}
                                </button>
                            </div>
                    </>
                    )}

            </div>
      )
    : (
        <div>
            <button
                onClick={() => { changeUserWantsToDeleteAccount(true) }}
                className='delete-account-button'
            >
                Delete
            </button>
        </div>
      )
}
