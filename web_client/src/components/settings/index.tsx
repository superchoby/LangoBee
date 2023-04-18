import { useState } from 'react'
import { SettingsSection } from './SettingsSection'
import { CloudinaryUploadWidget } from './CloudinaryUploadWidget'
import { ProfilePic } from '../shared/ProfilePic'
import { useAppSelector } from '../../app/hooks'
import { updateSrsLimit } from 'src/app/userSlice'
import { useAppDispatch } from '../../app/hooks'
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
}: {changeCurrentlyEditing(editing: boolean): void}) => {
    return (
        <button className='settings-change-button' onClick={() => changeCurrentlyEditing(true)}>change</button>
    )
} 

export const Settings = (): JSX.Element => {
    const [editingLessonsLimit, changeEditingLessonsLimit] = useState(false)
    const { username, email, srsLimit } = useAppSelector(state => state.user)
    const [currentLessonLimit, changeCurrentLessonLimit] = useState(srsLimit)
    const [userSettingInvalidLessonLimit, changeUserSettingInvalidLessonLimit] = useState(false)
    const dispatch = useAppDispatch()

    const handleLessonsLimitSave = () => {
        if (currentLessonLimit >= 1 && currentLessonLimit <= 500) {
            axios.post('users/change-srs-limit/', {newSrsLimit: currentLessonLimit})
            .then(_ => {
                changeUserSettingInvalidLessonLimit(false)
                dispatch(updateSrsLimit({newSrsLimit: currentLessonLimit}))
                changeEditingLessonsLimit(false)
            })
            .catch(_=> {
                console.log('error saving lessons limit')
                changeEditingLessonsLimit(false)
            })
        } else {
            changeUserSettingInvalidLessonLimit(true)
        }
    }

    

    const handleLessonsLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeCurrentLessonLimit(parseInt(event.target.value))
    }

    // TODO: Add delete account for testing purproses
    // then will have test flow user can sign up, then go in and set review to 500, do the lessons
    // then get the reviews all ready by creating new endoint to make all reviews avialb,e
    // speed run that then delete acc after

  return (
        <div className='settings-page-container'>
            {/* <BackButton /> */}
            <div className='settings-header'>Settings</div>
            <div className='settings-sections'>
                <SettingsSection title='Lessons' isTheLastSection={false} >
                    <div>
                        <span className='bold-span'>Lessons Limit:</span> 
                        {editingLessonsLimit ? (
                            <div className='change-lessons-limit-input-container'>
                                <input 
                                    className='change-setting-input change-lessons-limit-input' 
                                    value={currentLessonLimit}
                                    onChange={handleLessonsLimitChange} 
                                    type='number' 
                                    min='1' 
                                    max='500' 
                                />
                                <button 
                                    className='settings-change-button' 
                                    onClick={() => {
                                        changeEditingLessonsLimit(false)
                                        changeCurrentLessonLimit(srsLimit)
                                        changeUserSettingInvalidLessonLimit(false)
                                    }} 
                                >
                                    cancel
                                </button> 
                                <button className='settings-change-button' onClick={handleLessonsLimitSave}>save</button>
                                <span className={userSettingInvalidLessonLimit ? 'incorrect-srs-limit-set' : ''}>&nbsp;(max is 500)</span>
                            </div>
                            
                        ) : (
                            <>&nbsp;{srsLimit} <ChangeSettingButton changeCurrentlyEditing={changeEditingLessonsLimit} /></>
                        )}
                        
                        {/* <button className='settings-change-butotn'>change</button> */}
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
