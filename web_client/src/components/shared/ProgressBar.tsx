import React from 'react'
import ProgressBarLibComp from '@ramonak/react-progress-bar'
import './ProgressBar.scss'

interface ProgressBarProps {
  currentAmtOfPoints: number
  totalPointsForCompletion: number
}
// Can't use name progress bar becuase of third party library component
/**
 * Shows how far the user is in the current quiz. Wrapper for ProgressBarLibComp third party component
 */
export const ProgressBar = ({
  currentAmtOfPoints,
  totalPointsForCompletion
}: ProgressBarProps): JSX.Element => {
  return (
        <div className='progress-container-wrapper'>
            <div className='progress-container'>
                <ProgressBarLibComp
                    bgColor='#58cc02'
                    completed={(currentAmtOfPoints / totalPointsForCompletion) * 100}
                    height='15px'
                    barContainerClassName='quiz-progress-bar'
                    margin='15px auto'
                    // width='80%'
                    transitionDuration='.3s'
                    isLabelVisible={false}
                />
                <div className='current-amt-points-to-total-ratio'>{currentAmtOfPoints}/{totalPointsForCompletion}</div>
            </div>
        </div>
  )
}
