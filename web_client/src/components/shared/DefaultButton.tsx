import React from 'react'
import './DefaultButton.scss'

interface DefaultButtonProps {
  onClick: () => void
  text: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  color?: 'blue'
}

export const DefaultButton = ({
  onClick,
  text,
  className,
  size,
  color
}: DefaultButtonProps): JSX.Element => {
  return (
        <div
            className={`
                default-button-container 
                ${size != null ? `${size}-default-button` : ''} 
                ${className != null ? className : ''}
                ${color != null ? `${color}-default-button` : ''}
            `}
            onClick={onClick}
        >
            {text}
        </div>
  )
}
