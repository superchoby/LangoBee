import React from 'react'
import './GrayLine.scss'

interface GrayLineProps {
  leftLine: boolean
  visible: boolean
}

export const GrayLine = ({
  leftLine,
  visible
}: GrayLineProps): JSX.Element => {
  return (
        <div
            className={`gray-line ${leftLine ? 'left-gray-line' : 'right-gray-line'}`}
            style={{ visibility: visible ? 'visible' : 'hidden' }}
        />
  )
}
