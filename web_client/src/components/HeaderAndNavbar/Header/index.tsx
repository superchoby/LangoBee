import './index.scss'
import {
  ProfileIcon,
  StreakIcon,
  NotificationsIcon
} from './HeaderIcons'
import { Link } from 'react-router-dom'
import { HOME_PATH } from 'src/paths'
import Logo from '../../../images/Logo.png'

export const Header = () => {
  return (
        <div className='header-container'>
            <div className='header'>
                <Link to={HOME_PATH}>
                    <img src={Logo} className='header-logo' alt="Logo" />
                </Link>
                <div className='header-right-side header-side-container'>
                    {/* <ArticlesLink /> */}
                    <StreakIcon />
                    <NotificationsIcon />
                    <ProfileIcon />
                </div>
            </div>
        </div>
  )
}
