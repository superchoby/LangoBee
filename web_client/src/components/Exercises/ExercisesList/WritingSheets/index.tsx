import { ExerciseBaseProps } from '../types'
import { getKanji, initDiagram, getDomFromString, StrokeOrderDiagram } from './GetKanjiStrokes'
import { useEffect, useRef, useState } from 'react'
import { WritingSheetsCharacterChoices } from './WritingSheetsCharacterChoices'
// import html2canvas from "html2canvas"
// import jsPDF from 'jspdf'
// import parse, { domToReact } from 'html-react-parser'

import './index.scss'

const baseUrl = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/'

function getCodePoint (kanji: string) {
  return kanji && kanji.codePointAt(0)!.toString(16).padStart(5, '0')
}

function getURL (kanji: string) {
  return `${baseUrl}${getCodePoint(kanji)}.svg`
}

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
        fetch(getURL(characterClicked))
          .then(async data => {
            return await data.text()
          })
          .then(svg => {
            // const diagram = <StrokeOrderDiagram svgDocument={getDomFromString(svg)} />
            changeKanjiDiagramsCache({
              ...kanjiDiagramsCache,
              [characterClicked]: svg
            })
            changeSelectedCharacters([...selectedCharacters, characterClicked].sort())
          })
      }
    }
  }

  // const wow: SVGElement = `<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
  // <g id="kvg:StrokePaths_03081" style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;">
  // <g id="kvg:03081" kvg:element="め">
  //     <path id="kvg:03081-s1" d="M27.48,31.75c1.75,1,2.41,3.09,2.5,5.25c0.5,11.62,2.75,23.5,7.25,31.38c1.39,2.44,5.38,8.5,7.25,10.38"/>
  //     <path id="kvg:03081-s2" d="M59.6,19.38c1,1.5,1.35,4.12,0.88,6.62c-2.75,14.62-13.62,37.75-20.1,47.24c-12.28,17.14-16.78,13.14-22.28,0.64c-5.38-15.38,26.4-42.18,53.42-35.28c29.08,8.27,23.96,46.02-7.98,50.15"/>
  // </g>
  // </g>
  // <g id="kvg:StrokeNumbers_03081" style="font-size:8;fill:#808080">
  //     <text transform="matrix(1 0 0 1 20.1 30)">1</text>
  //     <text transform="matrix(1 0 0 1 50.1 18)">2</text>
  // </g>
  // </svg>`

  return (
        <div>
            {/* <WritingSheetsCharacterChoices
                header='Hiragana'
                characters={HIRAGANA_CHARACTERS}
                selectedCharacters={selectedCharacters}
                onCharacterClick={onCharacterClick}
            />
            <button onClick={() => {
                if (pdfRef.current) {
                    html2canvas(pdfRef.current)
                    .then((canvas) => {
                      const imgData = canvas.toDataURL('image/png');
                      const pdf = new jsPDF();
                    //   @ts-ignore
                        pdf.addImage(imgData as HTMLImageElement, 'PNG', 0, 0);
                        pdf.save("download.pdf");
                    })
                }
            }}>yes</button>

            {parse(`<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
<g id="kvg:StrokePaths_03081" style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;">
<g id="kvg:03081" kvg:element="め">
	<path id="kvg:03081-s1" d="M27.48,31.75c1.75,1,2.41,3.09,2.5,5.25c0.5,11.62,2.75,23.5,7.25,31.38c1.39,2.44,5.38,8.5,7.25,10.38"/>
	<path id="kvg:03081-s2" d="M59.6,19.38c1,1.5,1.35,4.12,0.88,6.62c-2.75,14.62-13.62,37.75-20.1,47.24c-12.28,17.14-16.78,13.14-22.28,0.64c-5.38-15.38,26.4-42.18,53.42-35.28c29.08,8.27,23.96,46.02-7.98,50.15"/>
</g>
</g>
<g id="kvg:StrokeNumbers_03081" style="font-size:8;fill:#808080">
	<text transform="matrix(1 0 0 1 20.1 30)">1</text>
	<text transform="matrix(1 0 0 1 50.1 18)">2</text>
</g>
</svg>`, {
    replace: domNode => {
      console.dir(domNode, { depth: null });
    }
  })}

            <div className='writing-sheets-printout-container' ref={pdfRef}>
                {selectedCharacters.map((character, idx) => (
                    <>
                        <StrokeOrderDiagram svgDocument={getDomFromString(kanjiDiagramsCache[character])} key={idx} />
                        <br />
                    </>
                ))}
            </div> */}
        </div>
  )
}
