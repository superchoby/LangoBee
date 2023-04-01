import { useEffect, useState } from 'react'
// import { Tooltip } from '../Tooltip'
import { useLocation } from "react-router-dom"
import './HeaderIcon.scss'

interface HeaderIconWrapperProps {
  Icon: JSX.Element
  TooltipContents: JSX.Element
  isTheRightMostIcon: boolean
}

export const HeaderIconWrapper = ({
  Icon,
  TooltipContents,
  isTheRightMostIcon
}: HeaderIconWrapperProps): JSX.Element => {
  const [showTooltip, changeShowTooltip] = useState(false)
  const positionClassname = isTheRightMostIcon ? 'rightmost-header-element' : 'not-rightmost-header-element'
  const { pathname } = useLocation()

  useEffect(() => {
    changeShowTooltip(false)
  }, [pathname])

  return (
        <div
            className='header-element-container'
            data-testid='header-icon-wrapper'
            onMouseEnter={() => changeShowTooltip(true)}
            onMouseLeave={() => changeShowTooltip(false)}
        >
            <div className='header-element-icon-container'>
              {Icon}
              {showTooltip && <div className='tooltip-triangle' />}
            </div>

            {showTooltip && (
              <div className={`tooltip-contents-container ${positionClassname}`}>
                  <div className='tooltip-contents'>
                    {TooltipContents}
                  </div>
              </div>
            )}
        </div>
  )
}
