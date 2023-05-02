import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Canvas } from './Canvas'
import { WritingSheetsCharacterChoices } from './WritingSheetsCharacterChoices'
import { toKatakana } from 'wanakana'
import './index.scss'

function useWindowSize () {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize () {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => { window.removeEventListener('resize', updateSize) }
  }, [])
  return size
}

const HIRAGANA_CHARACTERS = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'やゆよ', 'らりるれろ', 'わをん', 'がぎぐげご', 'ざじずぜぞ', 'だぢづでど', 'ばびぶべぼ', 'ぱぴぷぺぽ'] as const
const KATAKANA_CHARACTERS = ['アイウエオ', 'カキクケコ', 'サシスセソ', 'タチツテト', 'ナニヌネノ', 'ハヒフヘホ', 'マミムメモ', 'ヤユヨ', 'ラリルレロ', 'ワヲン', 'ガギグゲゴ', 'ザジズゼゾ', 'ダヂヅデド', 'バビブベボ', 'パピプペポ'] as const

export const WritingCanvas = () => {
  const [selectedCharacters, changeSelectedCharacters] = useState<string[]>([])
  const onCharacterClick = (characterClicked: string, characterWasSelected: boolean) => {
    if (characterWasSelected) {
      changeSelectedCharacters(selectedCharacters.filter(char => char !== characterClicked))
    } else {
      changeSelectedCharacters([...selectedCharacters, characterClicked].sort())
    }
  }

  return (
        <div>
            <div className='all-character-choices-container'>
                <WritingSheetsCharacterChoices
                    header='Hiragana'
                    characters={HIRAGANA_CHARACTERS}
                    selectedCharacters={selectedCharacters}
                    onCharacterClick={onCharacterClick}
                />
                <WritingSheetsCharacterChoices
                    header='Katakana'
                    characters={KATAKANA_CHARACTERS}
                    selectedCharacters={selectedCharacters}
                    onCharacterClick={onCharacterClick}
                />
            </div>

            <div>
                <div>
                    {selectedCharacters.map((char) => (
                        <div>
                            {char}
                        </div>
                    ))}
                </div>
                <Canvas />
            </div>

        </div>
  )
}
