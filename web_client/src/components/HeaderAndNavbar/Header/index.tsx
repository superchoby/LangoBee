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
import { useMatch } from 'react-router-dom'
import { DICTIONARY_PATH } from 'src/paths'

export const Header = () => {
  const match = useMatch(`${DICTIONARY_PATH}/*`)

  return (
        <div className='header-container'>
            <div className='header'>
                <Link to={HOME_PATH}>
                    <img src={Logo} className='header-logo' alt="Logo" />
                </Link>
                {match == null && <SearchDictionary />}
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
