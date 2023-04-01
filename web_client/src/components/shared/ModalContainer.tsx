import React from 'react'
import './ModalContainer.scss'

interface ModalContainerProps {
  children: JSX.Element
  className?: string
}

export const ModalContainer = ({
  children,
  className
}: ModalContainerProps): JSX.Element => {
  return (
        <div className={`modal-container ${className ?? ''}`}>
            {children}
        </div>
  )
}
