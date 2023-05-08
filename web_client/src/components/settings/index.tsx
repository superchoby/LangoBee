import { type InputHTMLAttributes, useState } from 'react'
import { SettingsSection } from './SettingsSection'
import { ProfilePic } from '../shared/ProfilePic'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { 
  updateSrsLimit, 
  updateSubjectsPerSessionLimit,
  updateProfilePic,
} from 'src/app/userSlice'
import { DeleteAccount } from './DeleteAccount'
import axios from 'axios'
import './index.scss'

interface UserProfileInfoProps {
  header: string
  value: string
}

const UserProfileInfo = ({
  header,
  value
}: UserProfileInfoProps) => {
  return (
        <div className='user-profile-info-container'>
            <span className='settings-username-header'>{header}:</span> <br/> {value}
        </div>
  )
}

const ChangeSettingButton = ({
  changeCurrentlyEditing
}: { changeCurrentlyEditing: (editing: boolean) => void }) => {
  return (
        <button className='settings-change-button' onClick={() => { changeCurrentlyEditing(true) }}>change</button>
  )
}

interface EditableSettingProps {
  inputProps: InputHTMLAttributes<HTMLInputElement>
  initialState: string
  handleSave: (changeCurrentlyEditing: (editing: false) => void, newValue: string) => void
  isInputInvalid?: (input: string) => boolean
  inputRestrictionMsg?: string
}

const EditableSetting = ({
  inputProps,
  initialState,
  handleSave,
  isInputInvalid,
  inputRestrictionMsg
}: EditableSettingProps) => {
  const [currentlyEditing, changeCurrentlyEditing] = useState(false)
  const [inputIsInvalid, changeInputIsInvalid] = useState(false)
  const [currentState, changeCurrentState] = useState(initialState)

  const handleSaveWrapper = () => {
    if (!inputIsInvalid) {
      handleSave(changeCurrentlyEditing, currentState)
    }
  }

  const handleInputChange = (value: string) => {
    changeCurrentState(value)
    if (isInputInvalid != null) {
      changeInputIsInvalid(isInputInvalid(value))
    }
  }

  return currentlyEditing
    ? (
        <div className='change-lessons-limit-input-container'>
            <input
                className='change-setting-input change-lessons-limit-input'
                value={currentState}
                onChange={({ target: { value } }) => { handleInputChange(value) }}
                {...inputProps}
            />
            <button
                className='settings-change-button'
                onClick={() => {
                  changeCurrentlyEditing(false)
                  changeCurrentState(initialState)
                  changeInputIsInvalid(false)
                }}
            >
                cancel
            </button>
            <button className='settings-change-button' onClick={handleSaveWrapper}>save</button>
            {inputRestrictionMsg != null && 
              <span className={inputIsInvalid ? 'incorrect-srs-limit-set' : ''}>&nbsp;({inputRestrictionMsg})</span>
            }
        </div>
      )
    : (
        <>&nbsp;{currentState} <ChangeSettingButton changeCurrentlyEditing={changeCurrentlyEditing} /></>
      )
}

export const Settings = (): JSX.Element => {
  const {
    username,
    email,
    srsLimit,
    numOfSubjectsToTeachPerLesson
  } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const handleLessonsLimitSave = (changeCurrentlyEditing: (editing: false) => void, newLessonLimit: string) => {
    axios.post('users/change-srs-limit/', { newSrsLimit: parseInt(newLessonLimit) })
      .then(_ => {
        dispatch(updateSrsLimit({ newSrsLimit: parseInt(newLessonLimit) }))
        changeCurrentlyEditing(false)
      })
      .catch(_ => {
        console.error('error saving lessons limit')
        changeCurrentlyEditing(false)
      })
  }

  const handleSubjectsPerSessionSave = (changeCurrentlyEditing: (editing: false) => void, newSubjectsLimit: string) => {
    axios.post('users/upload-pfp/', { newSubjectsLimit: parseInt(newSubjectsLimit) })
      .then(_ => {
        dispatch(updateSubjectsPerSessionLimit({ updateSubjectsPerSessionLimit: parseInt(newSubjectsLimit) }))
        changeCurrentlyEditing(false)
      })
      .catch(_ => {
        console.error('error saving subjects limit')
        changeCurrentlyEditing(false)
      })
  }

  const uploadNewPfp = (changeCurrentlyEditing: (editing: false) => void, newPfp: string) => {
    axios.post('users/upload-pfp/', { new_pfp: newPfp })
      .then(_ => {
        dispatch(updateProfilePic({ profilePicture: newPfp }))
        changeCurrentlyEditing(false)
      })
      .catch(_ => {
        changeCurrentlyEditing(false)
      })
  }

  return (
        <div className='settings-page-container'>
            <div className='settings-header'>Settings</div>
            <div className='settings-sections'>
                <SettingsSection title='Lessons' isTheLastSection={false}>
                    <div>
                        <div>
                            <span className='bold-span'>Subjects Limit Per Day:</span>
                            <EditableSetting
                                inputProps={{
                                  type: 'number',
                                  min: '1',
                                  max: '500'
                                }}
                                initialState={srsLimit.toString()}
                                handleSave={handleLessonsLimitSave}
                                isInputInvalid={(value: string) => {
                                  const parsedValue = parseInt(value)
                                  return parsedValue < 1 || parsedValue > 500
                                }}
                                inputRestrictionMsg='max is 500'
                            />
                        </div>
                        <div>
                            <span className='bold-span'>Subjects Per Session:</span>
                            <EditableSetting
                                inputProps={{
                                  type: 'number',
                                  min: '1',
                                  max: '20'
                                }}
                                initialState={numOfSubjectsToTeachPerLesson.toString()}
                                handleSave={handleSubjectsPerSessionSave}
                                isInputInvalid={(value: string) => {
                                  const parsedValue = parseInt(value)
                                  return parsedValue < 1 || parsedValue > 20
                                }}
                                inputRestrictionMsg='max is 20'
                            />
                        </div>
                    </div>
                </SettingsSection>
                <SettingsSection title='Profile Info' isTheLastSection={false} >
                    <div className='profile-info-settings-container'>
                        <div className='settings-change-pfp-container'>
                            <ProfilePic containerClassName='settings-pfp-container' />
                            <EditableSetting
                              inputProps={{
                                type: 'file',
                                accept: 'image/jpeg, image/png, image/jpg'
                              }}
                              initialState=''
                              handleSave={uploadNewPfp}
                            />
                        </div>

                        <div>
                            <UserProfileInfo header='Username' value={username} />
                            <UserProfileInfo header='Email' value={email} />
                            {/* {
                                Will use this to eventually add a change username fetaure
                                editingUsername ? (
                                    <div>
                                        <input className='change-username-input' defaultValue={username} />
                                        <div className='editing-username-buttons'>
                                            <button onClick={() => changeEditingUsername(false)} >cancel</button>
                                            <button onClick={handleUsernameSave}>save</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {username} <BiPencil onClick={() => changeEditingUsername(true)} />
                                    </div>
                                )
                            } */}
                        </div>
                    </div>
                </SettingsSection>

                <SettingsSection title='Delete Account' isTheLastSection={true} >
                    <DeleteAccount />
                </SettingsSection>
            </div>
        </div>
  )
}
