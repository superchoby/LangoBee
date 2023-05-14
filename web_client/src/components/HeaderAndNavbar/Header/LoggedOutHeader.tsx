import './LoggedOutHeader.scss'
import { Link } from 'react-router-dom'
import { 
    ROOT_PATH,
    LOGIN_PATH,
    SIGN_UP_PATH
} from 'src/paths'
import Logo from '../../../images/Logo.png'
export const LoggedOutHeader = () => {

  return (
        <div className='header-container logged-out-header-container'>
            <div className='header'>
                <Link to={ROOT_PATH}>
                    <img src={Logo} className='header-logo' alt="Logo" />
                </Link>
                <div className='header-right-side header-side-container logged-out-header-right-side'>
                    <Link to={LOGIN_PATH} className='logged-out-header-login'>Login</Link>
                    <Link to={SIGN_UP_PATH} className='logged-out-header-sign-up'>Sign Up</Link>
                </div>
            </div>
        </div>
  )
}
