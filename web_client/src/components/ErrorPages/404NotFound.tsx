import { Link } from 'react-router-dom'
import { HOME_PATH } from 'src/paths'
import './404NotFound.scss'

/**
 * Default page if user navigates to URL that doesn't exist
 */
export const NotFoundPage = (): JSX.Element => {
  return (
        <div className='page-not-found-container'>
            <div className='whoops-msg'>
                Whoops!
            </div>

            <div className='could-not-find-page-msg'>
                Sorry we couldn&apos;t find the page you are looking for 😔
            </div>

            <Link to={HOME_PATH} className='return-to-main-page-link'>
                <div>Back to Home</div>
            </Link>
        </div>
  )
}
