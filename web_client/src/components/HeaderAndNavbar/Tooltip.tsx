import React from 'react'
import './Tooltip.scss'

interface TooltipProps {
  children: JSX.Element
}

export const Tooltip = ({
  children
}: TooltipProps): JSX.Element => {
  return (
        <div className='tooltip-container'>
            <div className='tooltip-triangle' />
            <div className='tooltip-contents'>
                {children}
            </div>
        </div>
  )
}
