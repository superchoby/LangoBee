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
import { 
  FETCHED_DATA_SUCCESS,
  FETCHED_DATA_ERROR,
  FETHCED_DATA_PROCESSING,
  FETCH_TYPE,
} from '../shared/values'
import { MoonLoader } from 'react-spinners'
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
  const [newPfp, changeNewPfp] = useState<File | null>(null)
  const [uploadingPfp, changeUploadingPfp] = useState<FETCH_TYPE | null>(null)

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

  const uploadNewPfp = () => {
    if (newPfp != null) {
      changeUploadingPfp(FETHCED_DATA_PROCESSING)
      const formData = new FormData();
      formData.append('new_pfp', newPfp);
      axios.post('users/upload-pfp/', formData, {headers: {
        'Content-Type': 'multipart/form-data',
      }})
      .then(res => {
        changeUploadingPfp(FETCHED_DATA_SUCCESS)
        dispatch(updateProfilePic({ profilePicture: res.data.new_pfp_url }))
      })
      .catch(err => {
        changeUploadingPfp(FETCHED_DATA_ERROR)
      })
    }
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
                            {uploadingPfp === FETHCED_DATA_PROCESSING ? (
                              <MoonLoader size={20} />
                            ) : (
                              <ProfilePic 
                                customImage={newPfp != null ? URL.createObjectURL(newPfp) : null} 
                                imageClassName='settings-pfp-container' 
                              />
                            )}
                            
                            <input 
                              id='pfp-upload-input' 
                              type='file' 
                              accept='image/jpeg, image/png, image/jpg' 
                              hidden={true} 
                              onChange={( { target: { files } } ) => { if (files != null) changeNewPfp(files[0])}}
                              onClick={(event)=> { (event.target as HTMLInputElement).value = '' }}
                            />
                            {newPfp != null ? (
                              <div>
                                <button
                                    className='settings-change-button'
                                    onClick={() => {
                                      changeNewPfp(null)
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                  className='settings-change-button' 
                                  onClick={() => {
                                    uploadNewPfp()
                                    changeNewPfp(null)
                                  }}
                                >
                                    Save
                                </button>
                              </div>
                            ) : <label htmlFor='pfp-upload-input'>Change</label>}
                        </div>

                        <div>
                            <UserProfileInfo header='Username' value={username} />
                            <UserProfileInfo header='Email' value={email} />
                        </div>
                    </div>
                </SettingsSection>

                <SettingsSection title='Emails' isTheLastSection={false}>
                    <div>
                        
                    </div>
                </SettingsSection>

                <SettingsSection title='Delete Account' isTheLastSection={true} >
                    <DeleteAccount />
                </SettingsSection>
            </div>
        </div>
  )
}
