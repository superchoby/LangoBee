import './index.scss'
import {
  ProfileIcon,
  StreakIcon,
  // NotificationsIcon,
  ArticlesLink
} from './HeaderIcons'
import { Link } from 'react-router-dom'
import { HOME_PATH } from 'src/paths'
import Logo from '../../../images/Logo.png'
import { SearchDictionary } from './SearchDictionary'

export const Header = () => {
  return (
        <div className='header-container'>
            <div className='header'>
                <Link to={HOME_PATH}>
                    <img src={Logo} className='header-logo' alt="Logo" />
                </Link>
                <SearchDictionary />
                <div className='header-right-side header-side-container'>
                    <ArticlesLink />
                    <StreakIcon />
                    {/* <NotificationsIcon /> */}
                    <ProfileIcon />
                </div>
            </div>
        </div>
  )
}
