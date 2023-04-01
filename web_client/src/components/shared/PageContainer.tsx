import { BackButton } from './BackButton'
import { Link } from 'react-router-dom'
import { HOME_PATH } from 'src/paths'
import './PageContainer.scss'

interface PageContainerProps {
  className?: string
  header: string
  children: JSX.Element
  hasHomeButtonOnBottom: boolean
}

export const PageContainer = ({
  className,
  header,
  children,
  hasHomeButtonOnBottom
}: PageContainerProps): JSX.Element => {
  return (
        <div className={`page-container ${className ?? ''}`}>
            <BackButton />
            <h1 className='page-container-header'>{header}</h1>
            {children}
            {hasHomeButtonOnBottom && (
                <Link to={HOME_PATH} className='page-container-home-link'>
                    Home
                </Link>
            )}
        </div>
  )
}
