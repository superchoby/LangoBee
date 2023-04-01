import ProgressBar from '@ramonak/react-progress-bar'
import { Link } from 'react-router-dom'
import './index.scss'

export const ImmersionLevel = (): JSX.Element => {
  return (
        <div className='side-bar-section'>
            <h2 className="side-bar-header">
                Immersion Level
            </h2>
            <Link
                className='side-bar-link'
                to='/ImmersionLevelInfo'
            >
                More info on immersion level
            </Link>

            <div className='immersion-level-progress-bar-container'>
                <ProgressBar
                    bgColor='#0090ff'
                    completed={0}
                    height='15px'
                    isLabelVisible={false}
                />
            </div>

            <div className='what-percent-is-in-japanese'>
                Currently 1% of the site is displayed in Japanese
            </div>

        </div>
  )
}
