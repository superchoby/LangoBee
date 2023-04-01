import React from 'react'
import { GrayLine } from './GrayLine'
import './SrsLevelCircle.scss'

interface SrsLevelCircleProps {
  color: string
  hasLeftLine: boolean
  hasRightLine: boolean
  showCardsWithinSublevels: boolean
  cardsForEachSublevel: Array<{
    level: number
    numOfCards: number
  }>
}

export const SrsLevelCircle = ({
  color,
  hasLeftLine,
  hasRightLine,
  showCardsWithinSublevels,
  cardsForEachSublevel
}: SrsLevelCircleProps): JSX.Element => {
  return (
        <div className='srs-level-circle-container'>
            <GrayLine visible={hasLeftLine} leftLine={true} />
            { showCardsWithinSublevels &&
                <div
                    className='cards-within-sub-levels-container'
                    style={{
                      backgroundColor: color
                    }}
                >
                    {
                        cardsForEachSublevel.map(({ level, numOfCards }) => (
                            <div key={level}>
                                Level {level}: {numOfCards}
                            </div>
                        ))
                    }
                </div>
            }
            <div
                className='srs-level-circle'
                style={{
                  backgroundColor: color,
                  visibility: showCardsWithinSublevels ? 'hidden' : 'visible'
                }}
            />
            <GrayLine visible={hasRightLine} leftLine={false} />
        </div>
  )
}
