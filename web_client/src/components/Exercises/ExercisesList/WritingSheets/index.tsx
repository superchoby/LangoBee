import { ExerciseBaseProps } from '../types'
import { getKanji, initDiagram, getDomFromString, StrokeOrderDiagram } from './GetKanjiStrokes'
import { useEffect, useRef, useState } from 'react'
import { WritingSheetsCharacterChoices } from './WritingSheetsCharacterChoices'
import { useFetchStatus } from 'src/components/shared/useFetchStatus'
import { keysToCamel } from 'src/components/shared/keysToCamel'
import Yes from './fine'
import axios from 'axios'

import './index.scss'

const HIRAGANA_CHARACTERS = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'やゆよ', 'らりるれろ', 'わをん', 'がぎぐげご', 'ざじずぜぞ', 'だぢづでど', 'ばびぶべぼ', 'ぱぴぷぺぽ'] as const
const KATAKANA_CHARACTERS = ['アイウエオ', 'カキクケコ', 'サシスセソ', 'タチツテト', 'ナニヌネノ', 'ハヒフヘホ', 'マミムメモ', 'ヤユヨ', 'ラリルレロ', 'ワヲン', 'ガギグゲゴ', 'ザジズゼゾ', 'ダヂヅデド', 'バビブベボ', 'パピプペポ'] as const;

type KanjiByJLPT = {1: string[], 2: string[], 3: string[], 4: string[], 5: string[]}

export const WritingSheets = ({}: ExerciseBaseProps) => {
  // This link is to see the japaneseCharacter but like big so easier to tell https://jisho.org/search/%E5%90%8D%20%23kanji
  // const [kanjiDiagramsList, changeKanjiDiagramsList] = useState<JSX.Element[]>([])
  const [selectedCharacters, changeSelectedCharacters] = useState<string[]>([])
  const [kanjiDiagramsCache, changeKanjiDiagramsCache] = useState<{
    [character: string]: {
      characterStrokeNumbers: { number: number, transform: string }
      strokePaths: string[]
    }
  }>({})
  const [kanjiCharactersByJLPT, changeKanjiCharactersByJLPT] = useState<KanjiByJLPT>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  })
  const { 
    fetchData: fetchKanjiByJLPT, 
    isError: errorWithArticlesFetch,
  } = useFetchStatus<KanjiByJLPT>(`subjects/get_kanji_by_jlpt/`, 'get', changeKanjiCharactersByJLPT)

  useEffect(() => {
    fetchKanjiByJLPT()
  }, [fetchKanjiByJLPT])

  const onCharacterClick = (characterClicked: string, characterWasSelected: boolean, character_type: 'kanji' | 'kana') => {
    if (characterWasSelected) {
      changeSelectedCharacters(selectedCharacters.filter(char => char !== characterClicked))
    } else {
      if (Object.prototype.hasOwnProperty.call(kanjiDiagramsCache, characterClicked)) {
        changeSelectedCharacters([...selectedCharacters, characterClicked].sort())
      } else {
        axios.get(`subjects/character_stroke_data/${character_type}/${characterClicked}`)
        .then(res => {
          changeSelectedCharacters([characterClicked, ...selectedCharacters].sort())
          changeKanjiDiagramsCache({
            [characterClicked]: {
              strokePaths: res.data.stroke_paths,
              characterStrokeNumbers: res.data.character_stroke_numbers
            },
            ...kanjiDiagramsCache,
          })
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
                onCharacterClick={(characterClicked: string, characterWasSelected: boolean) => {
                  onCharacterClick(characterClicked, characterWasSelected, 'kana')
                }}
            />
            <WritingSheetsCharacterChoices
                header='Katakana'
                characters={KATAKANA_CHARACTERS}
                selectedCharacters={selectedCharacters}
                onCharacterClick={(characterClicked: string, characterWasSelected: boolean) => {
                  onCharacterClick(characterClicked, characterWasSelected, 'kana')
                }}
            />
            <div>
              
            </div>
            <WritingSheetsCharacterChoices
                  header={`Kanji`}
                  characters={[]}
                  customContent={(
                    <>
                      {Object.entries(kanjiCharactersByJLPT)
                      .sort(([jlptLeveA], [jlptLeveB]) => Number(jlptLeveB) - Number(jlptLeveA))
                      .map(([jlptLevel, kanjiInThisLevel]) => (
                        <WritingSheetsCharacterChoices
                            header={`JLPT N${jlptLevel}`}
                            characters={kanjiInThisLevel}
                            selectedCharacters={selectedCharacters}
                            onCharacterClick={(characterClicked: string, characterWasSelected: boolean) => {
                              onCharacterClick(characterClicked, characterWasSelected, 'kanji')
                            }}
                        />
                      ))}
                    </>
                  )}
                  selectedCharacters={selectedCharacters}
                  onCharacterClick={(characterClicked: string, characterWasSelected: boolean) => {
                    onCharacterClick(characterClicked, characterWasSelected, 'kanji')
                  }}
              />
            <div>
                {selectedCharacters.map((char) => (
                    <div>
                        {char}
                    </div>
                ))}
            </div>
        </div>
  )
}
