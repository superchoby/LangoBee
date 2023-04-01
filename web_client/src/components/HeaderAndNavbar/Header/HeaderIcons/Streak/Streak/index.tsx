import fireIcon from '../fire.png'
import './index.scss'

export const STREAK_ICON_ALT = 'streak-icon'

interface StreakProps {
  streakLength: number
}

export const Streak = ({
  streakLength
}: StreakProps): JSX.Element => {
  return (
        <div className='streak-container'>
            <img className='streak-icon' src={fireIcon} alt={STREAK_ICON_ALT} />
            <span className='streak-count'>{streakLength}</span>
        </div>
  )
}
