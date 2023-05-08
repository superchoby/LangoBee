import {
  RxCaretDown,
  RxCaretUp
} from 'react-icons/rx'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HOME_PATH } from 'src/paths'
import ScrollContainer from 'react-indiana-drag-scroll'
import 'react-indiana-drag-scroll/dist/style.css'
import './index.scss'

const TOTAL_SUBJECTS_COUNT_FOR_EACH_JLPT_LEVEL = {
  5: {
    Kanji: 79,
    Grammar: 126,
    Vocabulary: 658
  },
  4: {
    Kanji: 166,
    Grammar: 150,
    Vocabulary: 580
  },
  3: {
    Kanji: 367,
    Grammar: 200,
    Vocabulary: 1803
  },
  2: {
    Kanji: 367,
    Grammar: 200,
    Vocabulary: 1836
  },
  1: {
    Kanji: 1232,
    Grammar: 180,
    Vocabulary: 3262
  }
} as const

type JLPT_LEVEL = 5 | 4 | 3 | 2 | 1

interface JLPTCategoryLevelsProps {
  level: JLPT_LEVEL
  colorForBar: [string, string]
  totalSubjects: number
  subjectsCompleted: number
}

const JLPTCategoryLevels = ({
  level,
  colorForBar,
  subjectsCompleted,
  totalSubjects
}: JLPTCategoryLevelsProps) => {
  const percentComplete = (subjectsCompleted / totalSubjects) * 100
  const jlptLevelName = `N${level}`

  return (
        <div className='jlpt-category-level'>
            <div className='jlpt-level-and-concepts-covered'>
                <span>{jlptLevelName}</span>
                <span>{subjectsCompleted} / {totalSubjects}</span>
            </div>

            <div className='jlpt-level-progress-container'>
                <div
                    className='jlpt-level-progress'
                    style={{
                      background: `linear-gradient(90deg, ${colorForBar[0]} 0%, ${colorForBar[1]} 100%)`,
                      width: `${percentComplete}%`
                    }}
                />
                <div
                    className='jlpt-level-progress-remaining'
                    style={{
                      width: `${100 - percentComplete - 1}%`
                    }}
                />
            </div>
        </div>
  )
}

export interface JLPTStats {
  5: number
  4: number
  3: number
  2: number
  1: number
}

interface JLPTCategoryProps {
  name: 'Grammar' | 'Vocabulary' | 'Kanji'
  colorForBar: [string, string]
  jlptLevels: JLPTStats
}

export const JLPTCategory = ({
  name,
  colorForBar,
  jlptLevels
}: JLPTCategoryProps) => {
  const [dropdownIsOpen, changeDropdownIsOpen] = useState(false)
  const caretClassName = `jlpt-category-caret jlpt-category-caret-${name.toLowerCase()}`

  const handleCaretClick = () => {
    changeDropdownIsOpen(!dropdownIsOpen)
  }

  return (
        <div className='jlpt-category-container'>
            <div className='jlpt-category-header-and-caret'>
                <h3>{name}</h3>
                {dropdownIsOpen
                  ? (
                    <RxCaretUp
                        className={caretClassName}
                        onClick={handleCaretClick}
                    />
                    )
                  : (
                    <RxCaretDown
                        className={caretClassName}
                        onClick={handleCaretClick}
                    />
                    )}
            </div>
            <div style={{ display: dropdownIsOpen ? 'block' : 'none' }}>
                {([5, 4, 3, 2, 1] as const).map((jlptLevel: JLPT_LEVEL) => (
                    <JLPTCategoryLevels
                        key={jlptLevel}
                        level={jlptLevel}
                        colorForBar={colorForBar}
                        subjectsCompleted={jlptLevels[jlptLevel]}
                        totalSubjects={TOTAL_SUBJECTS_COUNT_FOR_EACH_JLPT_LEVEL[jlptLevel][name]}
                    />
                ))}
            </div>
        </div>
  )
}

interface JLPTContentCoveredProps {
  completedKanjiLevels: JLPTStats
  completedVocabLevels: JLPTStats
  completedGrammarLevels: JLPTStats
}

export const JLPTContentCovered = ({
  completedKanjiLevels,
  completedVocabLevels,
  completedGrammarLevels
}: JLPTContentCoveredProps) => {
    const { pathname } = useLocation()
    const isCurrentlyOnPreJLPT = (() => {
        for (let i = 1; i < 6; ++i) {
            const index = i as keyof JLPTStats
            if (completedKanjiLevels[index] + completedVocabLevels[index] + completedGrammarLevels[index] > 0) {
                return false
            }
        }
        return true
    })()

  const children = (
        <>
            <h2>JLPT</h2>
            {
                isCurrentlyOnPreJLPT
                  ? (
                    <div className='jlpt-content-covered-user-currently-on-pre-jlpt'>
                        <p>These stats will appear when you complete some JLPT concepts!</p>

                        <p>
                            The JLPT (Japanese Language Proficiency Test) is the
                            test taken by foreigners to prove
                            their Japanese skills
                        </p>
                    </div>
                    )
                  : (
                    <>
                        <JLPTCategory name='Kanji' jlptLevels={completedKanjiLevels} colorForBar={['#f2152f', '#f57684']} />
                        <JLPTCategory name='Vocabulary' jlptLevels={completedVocabLevels} colorForBar={['#00bd53', '#6fd69d']} />
                        <JLPTCategory name='Grammar' jlptLevels={completedGrammarLevels} colorForBar={['#460fd1', '#9274db']} />
                    </>
                    )
            }
        </>
  )

  return pathname === HOME_PATH
    ? (
        <ScrollContainer className='jlpt-content-covered-container'>
            {children}
        </ScrollContainer>
      )
    : (
        <div className='jlpt-content-covered-container'>
            {children}
        </div>
      )
}
