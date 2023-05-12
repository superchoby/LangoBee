import { useEffect, useState } from 'react'
// import { Tooltip } from '../Tooltip'
import { useLocation, useNavigate } from 'react-router-dom'
import './HeaderIcon.scss'

interface HeaderIconWrapperProps {
  Icon: JSX.Element
  TooltipContents?: JSX.Element
  isTheRightMostIcon: boolean
  isTheLeftMostIcon?: boolean
  link?: string
}

export const HeaderIconWrapper = ({
  Icon,
  TooltipContents,
  isTheRightMostIcon,
  link,
  isTheLeftMostIcon
}: HeaderIconWrapperProps): JSX.Element => {
  const [showTooltip, changeShowTooltip] = useState(false)
  const positionClassname = isTheRightMostIcon ? 'rightmost-header-element' : 'not-rightmost-header-element'
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    changeShowTooltip(false)
  }, [pathname])

  const marginClass = isTheLeftMostIcon === true ? {marginLeft: 0} : {}
  
  return (
        <div
            className='header-element-container'
            data-testid='header-icon-wrapper'
            style={{cursor: TooltipContents == null ? 'pointer' : 'auto', ...marginClass}}
            onMouseEnter={() => { changeShowTooltip(TooltipContents != null) }}
            onMouseLeave={() => { changeShowTooltip(false) }}
        >
            <div className='header-element-icon-container' onClick={() => { if (link != null)navigate(link) }}>
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
