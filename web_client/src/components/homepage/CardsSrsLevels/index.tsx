import { useState, useEffect } from 'react'
import { SrsLevelBlock } from './SrsLevelBlock'
import { Link } from 'react-router-dom'
import { REVIEWS_INFO_PATH } from 'src/paths'
import './index.scss'

interface CardsSrsLevelsProps {
  allSrsCards: Array<{
    currentLevel: {
      stage: number
      systemThisBelongsTo: {
        name: 'fast' | 'default'
      }
    }
  }>
}

export const CardsSrsLevels = ({
  allSrsCards
}: CardsSrsLevelsProps): JSX.Element => {
  const [beginnerCardsOneCount, changeBeginnerCardsOneCount] = useState(0)
  const [beginnerCardsTwoCount, changeBeginnerCardsTwoCount] = useState(0)
  const [beginnerCardsThreeCount, changeBeginnerCardsThreeCount] = useState(0)
  const [beginnerCardsFourCount, changeBeginnerCardsFourCount] = useState(0)
  const [noviceCardsOneCount, changeNoviceCardsOneCount] = useState(0)
  const [noviceCardsTwoCount, changeNoviceCardsTwoCount] = useState(0)
  const [intermediateCardsCount, changeIntermediateCardsCount] = useState(0)
  const [expertCardsCount, changeExpertCardsCount] = useState(0)
  const [masterCardsCount, changeMasterCardsCount] = useState(0)

  const beginnerCardsArr = [
    beginnerCardsOneCount,
    beginnerCardsTwoCount,
    beginnerCardsThreeCount,
    beginnerCardsFourCount
  ]

  const noviceCardsArr = [
    noviceCardsOneCount,
    noviceCardsTwoCount
  ]

  useEffect(() => {
    let newBeginnersOneCardsCount = 0
    let newBeginnersTwoCardsCount = 0
    let newBeginnersThreeCardsCount = 0
    let newBeginnersFourCardsCount = 0
    let newNoviceOneCardsCount = 0
    let newNoviceTwoCardsCount = 0
    let newIntermediateCardsCount = 0
    let newExpertCardsCount = 0
    let newMasterCardsCount = 0

    for (const { currentLevel: {stage: currentStage, systemThisBelongsTo: { name: systemType } } } of allSrsCards) {
      const isFastReviewCard = systemType === 'fast'
      if (isFastReviewCard) {
        switch (currentStage) {
          case 1:
            newBeginnersOneCardsCount += 1
            break
          case 2:
            newNoviceOneCardsCount += 1
            break
          case 3:
            newIntermediateCardsCount += 1
            break
          case 4:
            newExpertCardsCount += 1
            break
          case 5:
            newMasterCardsCount += 1
            break
        }
      } else {
        switch (currentStage) {
          case 1:
            newBeginnersOneCardsCount += 1
            break
          case 2:
            newBeginnersTwoCardsCount += 1
            break
          case 3:
            newBeginnersThreeCardsCount += 1
            break
          case 4:
            newBeginnersFourCardsCount += 1
            break
          case 5:
            newNoviceOneCardsCount += 1
            break
          case 6:
            newNoviceTwoCardsCount += 1
            break
          case 7:
            newIntermediateCardsCount += 1
            break
          case 8:
            newExpertCardsCount += 1
            break
          case 9:
            newMasterCardsCount += 1
            break
        }
      }
    }
  

    changeBeginnerCardsOneCount(newBeginnersOneCardsCount)
    changeBeginnerCardsTwoCount(newBeginnersTwoCardsCount)
    changeBeginnerCardsThreeCount(newBeginnersThreeCardsCount)
    changeBeginnerCardsFourCount(newBeginnersFourCardsCount)
    changeNoviceCardsOneCount(newNoviceOneCardsCount)
    changeNoviceCardsTwoCount(newNoviceTwoCardsCount)
    changeIntermediateCardsCount(newIntermediateCardsCount)
    changeExpertCardsCount(newExpertCardsCount)
    changeMasterCardsCount(newMasterCardsCount)
  }, [allSrsCards])

  return (
        <div className='side-bar-section cards-srs-levels-container'>
            <div className='your-cards-srs-levels-header-container'>
                <h2 className='side-bar-header your-cards-srs-levels-header'>Review&apos;s Mastery Levels</h2>
                <Link
                    className='side-bar-link'
                    to={REVIEWS_INFO_PATH}
                >
                    How does the review system work?
                </Link>
            </div>

            <div className='srs-levels-block-container'>
                <SrsLevelBlock
                    numberOfCardsAtThisLevel={beginnerCardsArr.reduce((partialSum, a) => partialSum + a, 0)}
                    hasLeftLine={false}
                    hasRightLine={true}
                    cardsForEachSublevel={[
                      {
                        level: 1,
                        numOfCards: beginnerCardsOneCount
                      },
                      {
                        level: 2,
                        numOfCards: beginnerCardsTwoCount
                      },
                      {
                        level: 3,
                        numOfCards: beginnerCardsThreeCount
                      },
                      {
                        level: 4,
                        numOfCards: beginnerCardsFourCount
                      }
                    ]}
                    color='#2C97DE'
                    stageName='Beginner'
                />
                <SrsLevelBlock
                    numberOfCardsAtThisLevel={noviceCardsArr.reduce((partialSum, a) => partialSum + a, 0)}
                    hasLeftLine={true}
                    hasRightLine={true}
                    cardsForEachSublevel={[
                      {
                        level: 5,
                        numOfCards: noviceCardsOneCount
                      },
                      {
                        level: 6,
                        numOfCards: noviceCardsTwoCount
                      }
                    ]}
                    color='#EFC662'
                    stageName='Novice'
                />
                <SrsLevelBlock
                    numberOfCardsAtThisLevel={intermediateCardsCount}
                    hasLeftLine={true}
                    hasRightLine={true}
                    cardsForEachSublevel={[
                      {
                        level: 7,
                        numOfCards: intermediateCardsCount
                      }
                    ]}
                    color='#E25F70'
                    stageName='Intermediate'
                />
                <SrsLevelBlock
                    numberOfCardsAtThisLevel={expertCardsCount}
                    hasLeftLine={true}
                    hasRightLine={true}
                    cardsForEachSublevel={[
                      {
                        level: 8,
                        numOfCards: expertCardsCount
                      }
                    ]}
                    color='#2BBF6C'
                    stageName='Expert'
                />
                <SrsLevelBlock
                    numberOfCardsAtThisLevel={masterCardsCount}
                    hasLeftLine={true}
                    hasRightLine={false}
                    cardsForEachSublevel={[
                      {
                        level: 9,
                        numOfCards: masterCardsCount
                      }
                    ]}
                    color='#9577DE'
                    stageName='Master'
                />
            </div>
        </div>
  )
}
