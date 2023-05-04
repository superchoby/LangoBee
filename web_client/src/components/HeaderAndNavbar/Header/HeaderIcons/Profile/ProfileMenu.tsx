import { useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { IoMail, IoSettingsOutline } from 'react-icons/io5'
import { LOGIN_PATH, CONTACT_US_PATH, SUBSCRIPTION_PATH } from 'src/paths'
import { BsCreditCardFill } from 'react-icons/bs'
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

  const goToContactUs = () => {
    navigate(CONTACT_US_PATH)
  }

  const logoutUser = (): void => {
    navigate(LOGIN_PATH)
  }

  const goToSubscription = () => {
    navigate(SUBSCRIPTION_PATH)
  }

  return (
        <ul className='profile-menu-list'>
            <li onClick={goToSettings}>
                <ProfileMenuLi icon={<IoSettingsOutline/>} name='Settings' />
            </li>
            <li onClick={goToContactUs}>
                <ProfileMenuLi icon={<IoMail/>} name='Contact' />
            </li>
            <li onClick={goToSubscription}>
                <ProfileMenuLi icon={<BsCreditCardFill/>} name='Subscription' />
            </li>
            <li onClick={logoutUser}>
                <ProfileMenuLi icon={<FiLogOut/>} name='Logout' />
            </li>
        </ul>
  )
}
