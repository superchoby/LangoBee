import { useMemo, useEffect, useState } from 'react'
import { convert } from './NumberConverters'
import { StartExerciseButton } from '../StartExerciseButton'
import { type ExerciseBaseProps } from '../types'
import { QuizGenerator } from 'src/components/shared/QuizGenerator'
import { type JapaneseSubjectData, EXERCISE_TYPE } from 'src/components/learning/lessons/SubjectTypes'
import { SubjectsSubInfoSection } from 'src/components/learning/SubjectsSubInfo'
import { HOME_PATH } from 'src/paths'
import './index.scss'

const generateRandomNumber = (maxNum: number) => {
  const theNineNineNineMaxVersionOfNum = (maxNum * 10) - 1
  return Math.floor(Math.random() * theNineNineNineMaxVersionOfNum)
}

// const numberToJapanese = {
//     10: '十 (じゅう)',
//     100: '百 (ひゃく)',
//     1000: '千 (せん)',
//     10000: '万 (まん)',
//     100000: '十万 (じゅうまん)',
//     1000000: '百万 (ひゃくまん )',
//     10000000: '千万 (せんまん)',
//     100000000: '億 (おく)',
//     // 十 百 千 万 十万 百万 千万 億
// } as const

const numberToJapanese = {
  10: '十',
  100: '百',
  1000: '千',
  10000: '万',
  100000: '十万',
  1000000: '百万',
  10000000: '千万',
  100000000: '億'
  // 十 百 千 万 十万 百万 千万 億
} as const

export const NumberDrills = ({
  exerciseHasStarted,
  changeExerciseHasStarted
}: ExerciseBaseProps) => {
    const [numbersToGuess, changeNumbersToGuess] = useState<JapaneseSubjectData[]>([])
    const [highestNumberToShow, changeHighestNumberToShow] = useState(100)

  useEffect(() => {
    if (exerciseHasStarted) {
      const numbersToGuess: number[] = []
      const amtOfNumbersToGuess = (() => {
        if (highestNumberToShow === 10) {
          return 10
        } else if (highestNumberToShow <= 1000) {
          return 8
        } else if (highestNumberToShow <= 100000) {
          return 6
        } else if (highestNumberToShow <= 10000000) {
          return 4
        } else {
          return 3
        }
      })()
      for (let i = 0; i < amtOfNumbersToGuess; ++i) {
        let number = generateRandomNumber(highestNumberToShow)
        while (numbersToGuess.includes(number)) {
          number = generateRandomNumber(highestNumberToShow)
        }
        numbersToGuess.push(number)
      }

      // header: 'Main',
      //   content: [
      //     (
      //   <SubjectsSubInfoSection subheader='Reading' key='Reading'>
      //     <span style={{fontWeight: 'bold'}}>{kanaSubject.reading}</span>
      //   </SubjectsSubInfoSection>
      //     ),
      //     (
      //       <SubjectsSubInfoSection subheader='Mnemonic' key='Mnemonic'>
      //         <div dangerouslySetInnerHTML={{__html: xmlDoc.documentElement.innerHTML}} className='kana-mnemonic-container' />
      //       </SubjectsSubInfoSection>
      //     )
      //   ]

      // const answerBreakdown = useMemo(() => {

      changeNumbersToGuess(numbersToGuess.map(number => {
        const numberReversed = `${number}`.split('').reverse().join('')
        const breakdown: Array<[string, string]> = []
        for (let i = 0; i < numberReversed.length; ++i) {
          if (numberReversed[i] !== '0') {
            breakdown.push([numberReversed[i], convert(`${numberReversed[i]}${'0'.repeat(i)}`, 'hiragana')])
          }
        }
        breakdown.reverse()

        return {
          questionToAsk: number.toLocaleString(),
          answers: [convert(`${number}`, 'hiragana'), convert(`${number}`, 'kanji')],
          questionPrompt: 'the Japanese translation',
          japaneseSubjectType: EXERCISE_TYPE,
          subjectId: number,
          hasUniqueSubjectModel: true,
          subjectType: '',
          infoToDisplay: [
            {
              header: 'Explanation',
              content: [
                (
                                    <SubjectsSubInfoSection subheader='Breakdown' key='Breakdown'>
                                        <ul className='number-drills-answer-breakdown'>
                                            {breakdown.map(([number, translation]) => (
                                                <li key={translation}>
                                                    <span className='number-drills-number-being-broke-down'>{number}</span>: {translation}
                                                </li>
                                            ))}
                                        </ul>
                                    </SubjectsSubInfoSection>
                )
              ]
            }
          ]
        }
      }))
    }
  }, [highestNumberToShow, exerciseHasStarted])

  const maxNumberChoices = useMemo(() => {
    const choices: JSX.Element[] = []
    let currentNum = '1'
    for (let i = 0; i < 8; ++i) {
      currentNum += '0'
      const numAsInt = parseInt(currentNum)
      choices.push(
                <div key={currentNum} onClick={() => { changeHighestNumberToShow(numAsInt) }} className='number-drills-max-digits-selection'>
                    <input
                        id={currentNum}
                        type="radio"
                        checked={numAsInt === highestNumberToShow}
                        onChange={() => {}}
                    />
                    <label htmlFor="html">{numAsInt} - {numberToJapanese[numAsInt as keyof typeof numberToJapanese]}</label>
                </div>
      )
    }

    return choices
  }, [highestNumberToShow])

  return (
        <div className='number-drills-container'>
            {
                exerciseHasStarted
                  ? (
                    <QuizGenerator
                        content={numbersToGuess}
                        errorMessage=''
                        onCompletedAllSubjectsQuestions={() => {}}
                        separateCorrectAndIncorrectSubjects={true}
                        resultsPageInfo={{
                          hasIncorrectSection: true,
                          leaveButtonLink: HOME_PATH,
                          leaveButtonText: 'HOME',
                          messageOnTop: 'One step further in mastering your numbers!'
                        }}
                    />
                    )
                  : (
                    <div className='number-drills-selection-screen-container'>
                        <h2 className='number-drills-header'>Number Drills</h2>
                        <span>Choose the max digits you want and practice those numbers!</span>

                        <div className='max-number-choices-and-header-container'>
                            <h3 className='max-number-choices-and-header'>Numbers</h3>
                            <div className='max-number-choices-container'>
                                {maxNumberChoices}
                            </div>
                        </div>

                        <StartExerciseButton startFunction={() => { changeExerciseHasStarted(true) }} />
                    </div>
                    )
            }

        </div>
  )
}
