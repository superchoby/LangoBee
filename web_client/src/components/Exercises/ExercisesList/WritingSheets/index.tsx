import { ExerciseBaseProps } from '../types'
import { getKanji, initDiagram, getDomFromString, StrokeOrderDiagram } from './GetKanjiStrokes'
import { useEffect, useRef, useState } from 'react'
import { WritingSheetsCharacterChoices } from './WritingSheetsCharacterChoices'
import Yes from './fine'
import axios from 'axios'

import './index.scss'

const HIRAGANA_CHARACTERS = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'やゆよ', 'らりるれろ', 'わをん', 'がぎぐげご', 'ざじずぜぞ', 'だぢづでど', 'ばびぶべぼ', 'ぱぴぷぺぽ'] as const

export const WritingSheets = ({}: ExerciseBaseProps) => {
  // This link is to see the japaneseCharacter but like big so easier to tell https://jisho.org/search/%E5%90%8D%20%23kanji
  // const [kanjiDiagramsList, changeKanjiDiagramsList] = useState<JSX.Element[]>([])
  const [selectedCharacters, changeSelectedCharacters] = useState<string[]>([])
  const [kanjiDiagramsCache, changeKanjiDiagramsCache] = useState<Record<string, string>>({})
  const pdfRef = useRef(null)

  const onCharacterClick = (characterClicked: string, characterWasSelected: boolean) => {
    if (characterWasSelected) {
      changeSelectedCharacters(selectedCharacters.filter(char => char !== characterClicked))
    } else {
      if (Object.prototype.hasOwnProperty.call(kanjiDiagramsCache, characterClicked)) {
        changeSelectedCharacters([...selectedCharacters, characterClicked].sort())
      } else {
        axios.get(`subjects/character_stroke_data/${characterClicked}`)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.error(err)
        })
          
      }
    }
  }


  return (
        <div>
            <WritingSheetsCharacterChoices
                header='Hiragana'
                characters={HIRAGANA_CHARACTERS}
                selectedCharacters={selectedCharacters}
                onCharacterClick={onCharacterClick}
            />
        </div>
  )
}
