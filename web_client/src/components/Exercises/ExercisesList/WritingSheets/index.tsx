import { useEffect, useMemo, useRef, useState } from 'react'
import { WritingSheetsCharacterChoices } from './WritingSheetsCharacterChoices'
import { useFetchStatus } from 'src/components/shared/useFetchStatus'
import { WritingDiagram, WritingDiagramProps } from './WritingDiagram'
import axios from 'axios'
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import './index.scss'

const HIRAGANA_CHARACTERS = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'やゆよ', 'らりるれろ', 'わをん', 'がぎぐげご', 'ざじずぜぞ', 'だぢづでど', 'ばびぶべぼ', 'ぱぴぷぺぽ'] as const
const KATAKANA_CHARACTERS = ['アイウエオ', 'カキクケコ', 'サシスセソ', 'タチツテト', 'ナニヌネノ', 'ハヒフヘホ', 'マミムメモ', 'ヤユヨ', 'ラリルレロ', 'ワヲン', 'ガギグゲゴ', 'ザジズゼゾ', 'ダヂヅデド', 'バビブベボ', 'パピプペポ'] as const;

type KanjiByJLPT = {1: string[], 2: string[], 3: string[], 4: string[], 5: string[]}

export const WritingSheets = () => {
  // This link is to see the japaneseCharacter but like big so easier to tell https://jisho.org/search/%E5%90%8D%20%23kanji
  // const [kanjiDiagramsList, changeKanjiDiagramsList] = useState<JSX.Element[]>([])
  const [selectedCharacters, changeSelectedCharacters] = useState<string[]>([])
  const [kanjiDiagramsCache, changeKanjiDiagramsCache] = useState<{
    [character: string]: WritingDiagramProps
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

  const diagramsContainer = useRef<HTMLDivElement | null>(null)

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

  const downloadPDF = () => {
    if (diagramsContainer.current != null) {
      html2canvas(diagramsContainer.current).then(function(canvas) {
        const imgData = canvas.toDataURL('image/png');

        const doc = new jsPDF();
        doc.addImage(imgData, 'PNG', 10, 10, canvas.clientWidth, canvas.clientHeight);

        const anchorElement = document.createElement('a');
        anchorElement.href = imgData;
        anchorElement.download = 'wow.png';

        document.body.appendChild(anchorElement);
        anchorElement.click();
      });
    }
  }

  return (
        <div className='writing-sheets-container'>
            <h1>Writing Sheets</h1>
            <p>
              Select the characters below and download a PDF of it to print and practice your writing!
            </p>
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
            <WritingSheetsCharacterChoices
                header={`Kanji`}
                characters={[]}
                customContent={(
                  <div className='writing-diagram-kanji-all-jlpt-container'>
                    {Object.entries(kanjiCharactersByJLPT)
                    .sort(([jlptLeveA], [jlptLeveB]) => Number(jlptLeveB) - Number(jlptLeveA))
                    .map(([jlptLevel, kanjiInThisLevel]) => (
                      <WritingSheetsCharacterChoices
                          key={jlptLevel}
                          header={`N${jlptLevel}`}
                          characters={kanjiInThisLevel}
                          selectedCharacters={selectedCharacters}
                          onCharacterClick={(characterClicked: string, characterWasSelected: boolean) => {
                            onCharacterClick(characterClicked, characterWasSelected, 'kanji')
                          }}
                      />
                    ))}
                  </div>
                )}
                selectedCharacters={selectedCharacters}
                onCharacterClick={(characterClicked: string, characterWasSelected: boolean) => {
                  onCharacterClick(characterClicked, characterWasSelected, 'kanji')
                }}
            />
            {selectedCharacters.length > 0 ? 
              (
                <button className='download-writing-diagrams-button' onClick={downloadPDF}>
                  Download
                </button>
              ) : 
              <p>Choose some characters to get started!</p>
            }
            
            <div className='all-writing-diagrams-container' ref={diagramsContainer}>
              {selectedCharacters.map((char) => (
                <WritingDiagram key={char} {...kanjiDiagramsCache[char]} />
              ))}
            </div>
        </div>
  )
}
