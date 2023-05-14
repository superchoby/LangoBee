import { BackButton } from './BackButton'
import { Link } from 'react-router-dom'
import { HOME_PATH, ROOT_PATH } from 'src/paths'
import './PageContainer.scss'

interface PageContainerProps {
  className?: string
  header: string
  children: JSX.Element
  hasHomeButtonOnBottom: boolean
  homeButtonGoesToRoot: boolean
}

export const PageContainer = ({
  className,
  header,
  children,
  hasHomeButtonOnBottom,
  homeButtonGoesToRoot
}: PageContainerProps): JSX.Element => {

  return (
        <div className={`page-container ${className ?? ''}`}>
            <BackButton link={homeButtonGoesToRoot ? ROOT_PATH : HOME_PATH} />
            <h1 className='page-container-header'>{header}</h1>
            {children}
            {hasHomeButtonOnBottom && (
                <Link to={homeButtonGoesToRoot ? ROOT_PATH : HOME_PATH} className='page-container-home-link'>
                    Home
                </Link>
            )}
        </div>
  )
}
