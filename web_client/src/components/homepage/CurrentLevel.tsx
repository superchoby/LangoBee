import { useEffect } from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import { getLevelInfo } from '../../app/userSlice'
import { useAppSelector } from '../../app/hooks'
import './CurrentLevel.scss'

interface CurrentLevelProps {
  /**
     * The username of the user
     */
  username: string
}

/**
 * Displays the username and current level/experience points of the user
 * @param username - The users username
 */
export const CurrentLevel = ({
  username
}: CurrentLevelProps): JSX.Element => {
  const { experiencePoints: currentExp } = useAppSelector(state => state.user)
  const {
    currentLevel,
    expUntilNextLevel,
    expPerLevel
  } = getLevelInfo(currentExp)

  useEffect(() => {
    const completedBarPortionElement = document.getElementsByClassName('exp-gained-portion-of-bar')[0] as HTMLElement
    completedBarPortionElement.style.width = `${((expPerLevel - expUntilNextLevel) / expPerLevel) * 100}%`
  }, [currentExp, expPerLevel, expUntilNextLevel])

  return (
        <div className='current-level-container'>
            <div className='current-level-description'>
                <div className='current-level-username'>{username}</div>
                <div className='exp-to-next-level-text'>{expUntilNextLevel} XP until Lv {currentLevel + 1}</div>
            </div>

            <ProgressBar
                bgColor="#64B5F6"
                barContainerClassName="level-exp-bar-container"
                completedClassName="exp-gained-portion-of-bar"
                completed={`${((currentExp % expPerLevel) / expPerLevel) * 100}%`}
                isLabelVisible={false}
                className='level-exp-bar'
            />
        </div>
  )
}
