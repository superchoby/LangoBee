import React from 'react'
import './LevelsBreakdownRow.scss'

interface LevelsBreakdownRowProps {
  level: number
  time: string
}

/**
 * Shows the association between SRS level and time until next review
 */
export const LevelsBreakdownRow = ({
  level,
  time
}: LevelsBreakdownRowProps): JSX.Element => {
  return (
        <div className='levels-breakdown-row-container'>
            Level {level} -&gt; {time}
        </div>
  )
}
