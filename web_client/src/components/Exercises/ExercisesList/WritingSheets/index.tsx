import { useEffect, useRef, useState } from 'react'
import { WritingSheetsCharacterChoices } from './WritingSheetsCharacterChoices'
import { useFetchStatus } from 'src/components/shared/useFetchStatus'
import { WritingDiagram, CharacterStrokeInfo } from './WritingDiagram'
import axios from 'axios'
import html2canvas from 'html2canvas';
import './index.scss'

const HIRAGANA_CHARACTERS = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'やゆよ', 'らりるれろ', 'わをん', 'がぎぐげご', 'ざじずぜぞ', 'だぢづでど', 'ばびぶべぼ', 'ぱぴぷぺぽ'] as const
const KATAKANA_CHARACTERS = ['アイウエオ', 'カキクケコ', 'サシスセソ', 'タチツテト', 'ナニヌネノ', 'ハヒフヘホ', 'マミムメモ', 'ヤユヨ', 'ラリルレロ', 'ワヲン', 'ガギグゲゴ', 'ザジズゼゾ', 'ダヂヅデド', 'バビブベボ', 'パピプペポ'] as const;
const CHARACTER_LIMIT_PER_PAGE = 5
type KanjiByJLPT = {1: string[], 2: string[], 3: string[], 4: string[], 5: string[]}
const NOT_PRINTING = 'not printing'
export const TRYING_TO_PRINT = 'trying to print'
export const CAN_PRINT_NOW = 'can print now'

export type PRINT_TYPE = typeof NOT_PRINTING | typeof TRYING_TO_PRINT | typeof CAN_PRINT_NOW

export const WritingSheets = () => {
  // This link is to see the japaneseCharacter but like big so easier to tell https://jisho.org/search/%E5%90%8D%20%23kanji
  // const [kanjiDiagramsList, changeKanjiDiagramsList] = useState<JSX.Element[]>([])
  const [selectedCharacters, changeSelectedCharacters] = useState<string[]>([])
  const [printStatus, changePrintStatus] = useState<PRINT_TYPE>(NOT_PRINTING)
  const [kanjiDiagramsCache, changeKanjiDiagramsCache] = useState<{
    [character: string]: CharacterStrokeInfo
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
  const characterLimitMessageRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    fetchKanjiByJLPT()
  }, [fetchKanjiByJLPT])

  const onCharacterClick = (characterClicked: string, characterWasSelected: boolean, character_type: 'kanji' | 'kana') => {
    if (characterWasSelected) {
      changeSelectedCharacters(selectedCharacters.filter(char => char !== characterClicked))
    } else if (selectedCharacters.length < CHARACTER_LIMIT_PER_PAGE) {
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
    } else if (characterLimitMessageRef.current) {
      characterLimitMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const downloadPDF = () => {
    changePrintStatus(TRYING_TO_PRINT)
  }

  useEffect(() => {
    const diagramContainerRef = diagramsContainer.current
    if (diagramContainerRef != null && printStatus === CAN_PRINT_NOW) {
      html2canvas(diagramContainerRef, {
        windowHeight: 2572,
        windowWidth: 1384
      }).then(function(canvas) {
        const imgData = canvas.toDataURL('image/png');
        // const doc = new jsPDF("l", "mm", "a4");
        // doc.addImage(imgData, 'PNG', 10, 10, diagramContainerRef.clientWidth, diagramContainerRef.clientHeight);
        // doc.save('writing_diagram.pdf')
        const anchorElement = document.createElement('a');
        anchorElement.href = imgData;
        anchorElement.download = 'wow.png';

        document.body.appendChild(anchorElement);
        anchorElement.click();

        changePrintStatus(NOT_PRINTING)
        changeSelectedCharacters([])
      });
    }
  }, [printStatus])

  return (
        <div className='writing-sheets-container'>
            <h1>Writing Sheets</h1>
            <p>
              Select the characters below and download an image of it to print and practice your writing!
            </p>
            <WritingSheetsCharacterChoices
                header='Hiragana'
                characters={HIRAGANA_CHARACTERS}
                printStatus={printStatus} 
                selectedCharacters={selectedCharacters}
                onCharacterClick={(characterClicked: string, characterWasSelected: boolean) => {
                  onCharacterClick(characterClicked, characterWasSelected, 'kana')
                }}
            />
            <WritingSheetsCharacterChoices
                header='Katakana'
                characters={KATAKANA_CHARACTERS}
                printStatus={printStatus} 
                selectedCharacters={selectedCharacters}
                onCharacterClick={(characterClicked: string, characterWasSelected: boolean) => {
                  onCharacterClick(characterClicked, characterWasSelected, 'kana')
                }}
            />
            <WritingSheetsCharacterChoices
                header={`Kanji`}
                characters={[]}
                printStatus={printStatus} 
                customContent={(
                  <div className='writing-diagram-kanji-all-jlpt-container'>
                    {Object.entries(kanjiCharactersByJLPT)
                    .sort(([jlptLeveA], [jlptLeveB]) => Number(jlptLeveB) - Number(jlptLeveA))
                    .map(([jlptLevel, kanjiInThisLevel]) => (
                      <WritingSheetsCharacterChoices
                          key={jlptLevel}
                          printStatus={printStatus} 
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

            <p 
              className={selectedCharacters.length >= CHARACTER_LIMIT_PER_PAGE ? 'character-write-diagram-limit-message' : ''} 
              ref={characterLimitMessageRef}
            >
              {selectedCharacters.length < CHARACTER_LIMIT_PER_PAGE ? 
                `You can add a total of ${CHARACTER_LIMIT_PER_PAGE - selectedCharacters.length} more` : 
                'You have have added the max amount! You can download these characters and then add more after'
              }
            </p>
            
            <div className='all-writing-diagrams-container' ref={diagramsContainer}>
              {selectedCharacters.map((char) => (
                <WritingDiagram 
                  key={char} 
                  {...kanjiDiagramsCache[char]} 
                  printStatus={printStatus} 
                  changePrintStatusToPrintNow={() => changePrintStatus(CAN_PRINT_NOW)}
                />
              ))}
            </div>
        </div>
  )
}
