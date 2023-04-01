import { Link } from 'react-router-dom'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { HOME_PATH } from 'src/paths'
import './BackButton.scss'

interface BackButtonProps {
  text?: string
  link?: string
}

export const BackButton = ({
  text = 'Home',
  link = HOME_PATH
}: BackButtonProps): JSX.Element => {
  return (
        <div className='page-back-button-container'>
            <Link to={link} className='page-back-button'>
                <AiOutlineArrowLeft /> {text}
            </Link>
        </div>
  )
}
