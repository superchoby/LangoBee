import { useState } from 'react'
import { SrsLevelCircle } from './SrsLevelCircle'
import './SrsLevelBlock.scss'

interface SrsLevelBlockProps {
  numberOfCardsAtThisLevel: number
  color: string
  stageName: string
  hasLeftLine: boolean
  hasRightLine: boolean
  cardsForEachSublevel: Array<{
    level: number
    numOfCards: number
  }>
}

export const SrsLevelBlock = ({
  numberOfCardsAtThisLevel,
  color,
  stageName,
  hasLeftLine,
  hasRightLine,
  cardsForEachSublevel
}: SrsLevelBlockProps): JSX.Element => {
  const [mouseIsOver, changeMouseIsOver] = useState(false)

  return (
        <div className='srs-level-block-container' onMouseOver={() => { changeMouseIsOver(true) }} onMouseLeave={() => { changeMouseIsOver(false) }}>
            <div>{numberOfCardsAtThisLevel}</div>
            <SrsLevelCircle
                color={color}
                hasLeftLine={hasLeftLine}
                hasRightLine={hasRightLine}
                showCardsWithinSublevels={mouseIsOver}
                cardsForEachSublevel={cardsForEachSublevel}
            />
            <div className='srs-level-block-stage-name'>{stageName}</div>
        </div>
  )
}
