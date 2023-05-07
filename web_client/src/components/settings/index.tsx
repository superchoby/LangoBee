import { type InputHTMLAttributes, useState } from 'react'
import { SettingsSection } from './SettingsSection'
import { CloudinaryUploadWidget } from './CloudinaryUploadWidget'
import { ProfilePic } from '../shared/ProfilePic'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { updateSrsLimit, updateSubjectsPerSessionLimit } from 'src/app/userSlice'
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
  initialState: number
  handleSave: (changeCurrentlyEditing: (editing: false) => void, newValue: number) => void
  isInputInvalid: (input: number) => boolean
  imputRestrictionMsg: string
}

const EditableSetting = ({
  inputProps,
  initialState,
  handleSave,
  isInputInvalid,
  imputRestrictionMsg
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
    const correctValueType = parseInt(value)
    changeCurrentState(correctValueType)
    changeInputIsInvalid(isInputInvalid(correctValueType))
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
            <span className={inputIsInvalid ? 'incorrect-srs-limit-set' : ''}>&nbsp;({imputRestrictionMsg})</span>
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

  const handleLessonsLimitSave = (changeCurrentlyEditing: (editing: false) => void, newLessonLimit: number) => {
    axios.post('users/change-srs-limit/', { newSrsLimit: newLessonLimit })
      .then(_ => {
        dispatch(updateSrsLimit({ newSrsLimit: newLessonLimit }))
        changeCurrentlyEditing(false)
      })
      .catch(_ => {
        console.error('error saving lessons limit')
        changeCurrentlyEditing(false)
      })
  }

  const handleSubjectsPerSessionSave = (changeCurrentlyEditing: (editing: false) => void, newSubjectsLimit: number) => {
    axios.post('users/change-subjects-per-session-limit/', { newSubjectsLimit })
      .then(_ => {
        dispatch(updateSubjectsPerSessionLimit({ updateSubjectsPerSessionLimit: newSubjectsLimit }))
        changeCurrentlyEditing(false)
      })
      .catch(_ => {
        console.error('error saving subjects limit')
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
                                initialState={srsLimit}
                                handleSave={handleLessonsLimitSave}
                                isInputInvalid={(value: number) => {
                                  return value < 1 || value > 500
                                }}
                                imputRestrictionMsg='max is 500'
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
                                initialState={numOfSubjectsToTeachPerLesson}
                                handleSave={handleSubjectsPerSessionSave}
                                isInputInvalid={(value: number) => {
                                  return value < 1 || value > 20
                                }}
                                imputRestrictionMsg='max is 20'
                            />
                        </div>
                    </div>
                </SettingsSection>
                {/* <SettingsSection title='Subscription Plan' isTheLastSection={false} >
                    <div>
                        <div>Beta User</div>
                        <div>Thank you for using the site since its beginning days! The site will forever be free for you as thanks :)</div>
                    </div>
                </SettingsSection> */}
                <SettingsSection title='Profile Info' isTheLastSection={false} >
                    <div className='profile-info-settings-container'>
                        <div className='settings-change-pfp-container'>
                            <ProfilePic containerClassName='settings-pfp-container' />
                            <CloudinaryUploadWidget className='change-pfp-button' />
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
