import { useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { IoSettingsOutline } from 'react-icons/io5'
import { LOGIN_PATH } from 'src/paths'
import './ProfileMenu.scss'

interface ProfileMenuLiProps {
  icon: JSX.Element
  name: string
}

const ProfileMenuLi = ({
  icon,
  name
}: ProfileMenuLiProps): JSX.Element => {
  return (
    <div className='profile-menu-li-container'>
      {icon}
      <span>{name}</span>
    </div>
  )
}

export const ProfileMenu = (): JSX.Element => {
  const navigate = useNavigate()

  const goToSettings = (): void => {
    navigate('/settings')
  }

  const logoutUser = (): void => {
    navigate(LOGIN_PATH)
  }

  return (
        <ul className='profile-menu-list'>
            <li onClick={goToSettings}>
                <ProfileMenuLi icon={<IoSettingsOutline/>} name='Settings' />
            </li>
            <li onClick={logoutUser}>
                <ProfileMenuLi icon={<FiLogOut/>} name='Logout' />
            </li>
        </ul>
  )
}
