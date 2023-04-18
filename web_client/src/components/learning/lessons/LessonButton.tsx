import { useEffect, useRef } from 'react'
import crown from './crown.png'
import { MdOutlineArticle } from 'react-icons/md'
import './LessonButton.scss'

const CurrentLessonButtonIndicator = () => {
    return (
        <div className='current-level-button-indicator-container'>
            <div className='current-level-button-indicator'>Here</div>
            <div className='current-level-button-indicator-tooltip-container'>
                <div className='current-level-button-indicator-tooltip' />
            </div>
        </div>
    )
}

export const LEVEL_BUTTON_TYPE = 'level'
export const ARTICLE_BUTTON_TYPE = 'article'

interface LessonButtonProps {
    currentButton: boolean
    isPastThisButtonsContents: boolean
    hasCompletedThisButton: boolean
    level?: number
    position: 1 | 2 | 3 | 4 | 5
    onClick(): void
    percentOfContentsComplete: number
    hideHereIndicator: boolean
    buttonType: typeof LEVEL_BUTTON_TYPE | typeof ARTICLE_BUTTON_TYPE
    color: number
}

const colors = {
    1: 'light-blue',
    2: 'light-pink',
    3: 'strong-yellow',
    4: 'red',
    5: 'light-green',
}

export const LessonButton = ({
    currentButton,
    isPastThisButtonsContents,
    hasCompletedThisButton,
    level,
    position,
    onClick,
    percentOfContentsComplete,
    hideHereIndicator,
    buttonType,
    color
}: LessonButtonProps) => {
    let levelsButtonClassname = `level-button-with-position-${position} levels-button `
    // levelsButtonClassname += (isPastThisLevel || currentLevel ? 'colored-level-button levels-button-progress' : 'unavailable-levels-button') + ' '
    levelsButtonClassname += (isPastThisButtonsContents || currentButton ? `colored-level-button-${color}` : 'unavailable-levels-button') + ' '
    const levelsProgressHighlightPercentage = isPastThisButtonsContents ? 100 : (currentButton ? percentOfContentsComplete : 0)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (currentButton && buttonRef.current) {
            buttonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [currentButton])

    return (
        <button
            className={levelsButtonClassname}
            onClick={onClick}
            style={{ background: `conic-gradient(var(--${colors[color as keyof typeof colors]}) ${levelsProgressHighlightPercentage}%, #ededed 0deg)` }}
            ref={buttonRef}
        >
            {currentButton && !hideHereIndicator && <CurrentLessonButtonIndicator />}
            {buttonType === LEVEL_BUTTON_TYPE ? (
                <span className="level-buttons-level">{level}</span>
            ) : (
                <MdOutlineArticle className="level-buttons-level" />
            )}
            
            {hasCompletedThisButton && <img src={crown} alt="completed" className='level-completed-crown' />}
        </button>
    )
}
