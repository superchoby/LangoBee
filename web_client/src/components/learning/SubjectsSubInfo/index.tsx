import { useEffect, useState, FC, useMemo, Fragment } from "react"
import { 
    JapaneseSubjectData,
    KANA_TYPE,
    RADICAL_TYPE,
    KANJI_TYPE,
    GRAMMAR_TYPE,
    GrammarSubject,
    VOCABULARY_TYPE,
    KanaSubject,
    RadicalSubject,
    KanjiSubject,
    JapaneseVocabularySubject,
    JapaneseSubjectType,
    JapaneseExerciseSubject,
    EXERCISE_TYPE,
    SubjectInfoToDisplay,
    GrammarFormalityAndDescriptions,
    JapaneseVocabularySubjectAudioFiles,
} from '../lessons/SubjectTypes'
import { toKatakana, isKana } from 'wanakana'
import { HiSpeakerWave } from 'react-icons/hi2'
import { DifferenceExplanation } from './DifferenceExplanation'
import './index.scss' 

function removeParenthesesContent(input: string): string {
  let output = '';
  let openParenthesesCount = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '(') {
      openParenthesesCount++;
    } else if (char === ')') {
      if (openParenthesesCount > 0) {
        openParenthesesCount--;
      }
    } else if (openParenthesesCount === 0) {
      output += char;
    }
  }

  return output.trim();
}


interface SubjectsSubInfoSectionProps {
    subheader: string
    children: JSX.Element
    isLastSubsection?: boolean
}

export const SubjectsSubInfoSection = ({
    subheader,
    children,
    isLastSubsection
}: SubjectsSubInfoSectionProps) => {

  return (
    <div className={`subject-presenter-section-subsection ${isLastSubsection ? 'last-subject-presenter-section-subsection' : ''}`}>
        <h3 className='subject-presenter-section-subheader'>{subheader}</h3>
        <div className='subject-presenter-section-contents'>{children}</div>
    </div>
  )
}

const KANJI_TO_NUMBER = {
  '一': { hiragana: 'いち', number: 1 },
  '二': { hiragana: 'に', number: 2 },
  '三': { hiragana: 'さん', number: 3 },
  '四': { hiragana: 'よん,し', number: 4 },
  '五': { hiragana: 'ご', number: 5 },
  '六': { hiragana: 'ろく', number: 6 },
  '七': { hiragana: 'なな,しち', number: 7 },
  '八': { hiragana: 'はち', number: 8 },
  '九': { hiragana: 'きゅう', number: 9 },
  '十': { hiragana: 'じゅう', number: 10 },
  '十一': { hiragana: 'じゅういち', number: 11 },
  '十二': { hiragana: 'じゅうに', number: 12 },
  '十三': { hiragana: 'じゅうさん', number: 13 },
  '十四': { hiragana: 'じゅうよん', number: 14 },
  '十五': { hiragana: 'じゅうご', number: 15 },
  '十六': { hiragana: 'じゅうろく', number: 16 },
  '十七': { hiragana: 'じゅうなな', number: 17 },
  '十八': { hiragana: 'じゅうはち', number: 18 },
  '十九': { hiragana: 'じゅうきゅう', number: 19 },
  '二十': { hiragana: 'にじゅう', number: 20 },
}

const HIGH_PITCH = 'high'
const LOW_PITCH = 'low'

interface SubjectsSubInfoAudioSectionProps {
  isLastSubsection?: boolean
  audioFiles: JapaneseVocabularySubjectAudioFiles[]
  characters: string[]
}

const SMALL_KANA = 'ゃゅょっャュョッ'

const SubjectsSubInfoAudioSection = ({
  isLastSubsection,
  audioFiles,
  characters
}: SubjectsSubInfoAudioSectionProps) => {

  const pronunciationComponents = useMemo(() => {
    const pronunciationComponents: JSX.Element[] = []
    if (characters != null && characters.length > 0) {
      
      for (let i=0; i<audioFiles.length; ++i) {
        const { file, lastHighPitch } = audioFiles[i]
        let pitchGraph: JSX.Element[] = []
        let currentPitch: typeof HIGH_PITCH | typeof LOW_PITCH = lastHighPitch === 1 ? HIGH_PITCH : LOW_PITCH
        let hasAlreadyGottenHigh = currentPitch === HIGH_PITCH
        let smallCharsSeen = 0
        if (lastHighPitch != null) {
          const lastHighPitchAccountForSmallKana = lastHighPitch + characters[i].split('').filter(char => SMALL_KANA.includes(char)).length
          for (let j=1; j<=characters[i].length; ++j) {
            if (SMALL_KANA.includes(characters[i][j-1])) {
              smallCharsSeen += 1
            }
            let className = ''
            if (currentPitch === LOW_PITCH) {
              className = 'pitch-breakdown-low'
              if (!hasAlreadyGottenHigh && j < characters[i].length && !SMALL_KANA.includes(characters[i][j])) {
                className += ' pitch-breakdown-low-to-high'
                currentPitch = HIGH_PITCH
                hasAlreadyGottenHigh = true
              }
            } else {
              className = 'pitch-breakdown-high'
              if (j === lastHighPitchAccountForSmallKana) {
                className += ' pitch-breakdown-high-to-low'
                currentPitch = LOW_PITCH
              }
            }

            pitchGraph.push(<span className={className} key={j}>{characters[i][j-1]}</span>)
          }
        }
        
        pronunciationComponents.push(
          <div 
            className='subject-presenter-section-contents subject-presenter-audio-player-container' 
            key={i}
            onClick={() => (new Audio(file)).play() }
          >
            <HiSpeakerWave className='subject-presenter-section-play-audio' /> 
            <div className='subject-presenter-character-pitch-breakdown'>
              {pitchGraph.length > 0 ? (pitchGraph) : (
                <span>{characters[i]}</span>
              )}
            </div>
          </div>
        )
      }
    }
    
    return pronunciationComponents
  }, [audioFiles, characters])
  
  return (
    <div className={`subject-presenter-section-subsection ${isLastSubsection ? 'last-subject-presenter-section-subsection' : ''}`}>
        <h3 className='subject-presenter-section-subheader'>Pronunciation</h3>
        {pronunciationComponents}
          
    </div>
  )
}

export const defaultSubjectPresenterProps = {
    subjectText:'',
    subjectMainDescription: '',
    subjectType: 'kana' as JapaneseSubjectType,
    subjectInfoToDisplay: []
}

export interface SubjectsInfoForComponents {
    subjectText: string
    subjectMainDescription: string
    subjectType: JapaneseSubjectType
    subjectInfoToDisplay: SubjectInfoToDisplay[]
    audioFiles?: string[]
}

export const parseHtmlString = (htmlString: string, className?: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(`<p>${htmlString}</p>`,"text/xml");
  const bolds = xmlDoc.getElementsByTagName('bold')
  while (bolds.length > 0) {
    const span = document.createElement('span')
    span.classList.add('bold-span')
    span.textContent = bolds[0].textContent
    bolds[0].replaceWith(span)
  }

  return <p dangerouslySetInnerHTML={{__html: xmlDoc.documentElement.innerHTML}} className={className} />
}

const SpecialKanaExplanation = ({explanation}: {explanation: string}) => {
  const getValues = (valueName: string, stringToExtract: string) => {
    const startingTag = `<${valueName}>`
    const endingTag = `</${valueName}>`
    const values: string[] = [];
    let startIndex: number = 0;
    let endIndex: number = 0;
    while (startIndex !== -1 && endIndex !== -1) {
      startIndex = stringToExtract.indexOf(startingTag, startIndex);
  
      if (startIndex !== -1) {
        endIndex = stringToExtract.indexOf(endingTag, startIndex + startingTag.length);
  
        if (endIndex !== -1) {
          const substring = stringToExtract.slice(startIndex + startingTag.length, endIndex);
          values.push(substring);
          startIndex = endIndex + endingTag.length;
        }
      }
    }
    return values
  }

  const kanaExplanation = getValues('explanation', explanation)[0]
  const examples = getValues('SpecialKanaExplanationExample', explanation)

  return (
    <div>
      {kanaExplanation}
      <br />
      {examples.map(example => {
        const audioUrl = getValues('AudioUrl', example)[0]
        const kanaExample = getValues('KanaExample', example)[0]
        const romajiExample = getValues('RomajiExample', example)[0]
        return (
          <div 
            className='subject-presenter-section-contents subject-presenter-audio-player-container' 
            key={kanaExample}
            onClick={() => (new Audio(audioUrl)).play() }
          >
            <HiSpeakerWave className='subject-presenter-section-play-audio' /> 
            <div>{kanaExample} -&gt; {romajiExample}</div>
          </div>
        )
      })}
    </div>    
  )
}


type ContainedRadical = {
  character: string
  meaning: string
  type: typeof RADICAL_TYPE
}

type ContainedOrExampleKanji = {
  character: string
  meanings: string[]
  type: typeof KANJI_TYPE
}

interface JapaneseExamplesAndContainedSubjectsProps {
  subjects: (ContainedRadical | ContainedOrExampleKanji)[]
}

const JapaneseExamplesAndContainedSubjects = ({
  subjects,
}: JapaneseExamplesAndContainedSubjectsProps) => {

  return (
    <div className='list-of-other-japanese-subjects'>
      {subjects.map((subject) => {
        const { type } = subject
        let characters = ''
        let description = ''
        if (type === RADICAL_TYPE) {
          characters = subject.character
          description = subject.meaning
        } else if (type === KANJI_TYPE) {
          characters = subject.character
          description = subject.meanings[0] 
        }

        return (
          <div key={characters} className='other-japanese-subjects-container'>
            <div className='other-japanese-subjects-character'>{characters}</div>
            <span className='other-japanese-subjects-description'>{description}</span>
          </div>
        )
      })}
    </div>
  )
}

export const getPropsForSubjectsInfo = (subject: JapaneseSubjectData, isForQuiz: boolean): SubjectsInfoForComponents => {
    if (subject.hasUniqueSubjectModel) {
      switch (subject.japaneseSubjectType) {
        case KANA_TYPE:
          const kanaSubject = subject as KanaSubject
          const kanaMnemonicImage = kanaSubject.mnemonicImage
          const kanaSubjectInfoToDisplay: JSX.Element[] = []
          if (kanaSubject.audioFile != null) {
            kanaSubjectInfoToDisplay.push(
              <SubjectsSubInfoAudioSection key='Pronunciation' audioFiles={[{file: kanaSubject.audioFile, lastHighPitch: null}]} characters={['']} />
            )
          }
          if (isForQuiz) {
            kanaSubjectInfoToDisplay.push(
              <SubjectsSubInfoSection subheader='Reading' key='Reading'>
                <span style={{fontWeight: 'bold'}}>
                  {kanaSubject.reading.includes(',') ? (
                    kanaSubject.reading.split(',').join(', ')
                  ) : (
                    kanaSubject.reading
                  )}
                </span>
              </SubjectsSubInfoSection>
            )
          }

          if (kanaSubject.mnemonicExplanation.length > 0) {
            kanaSubjectInfoToDisplay.push(
              <SubjectsSubInfoSection subheader='Mnemonic' key='Mnemonic' isLastSubsection={kanaSubject.specialKanaExplanation == null}>
                <>
                  {parseHtmlString(kanaSubject.mnemonicExplanation, 'kana-mnemonic-container')}
                  {kanaMnemonicImage.length > 0 && (
                    <img className='subjects-sub-info-mnemonic-image' src={kanaMnemonicImage} alt={`mnemonic-for-${kanaSubject.character}`} />
                  )}
                </>
              </SubjectsSubInfoSection>
            )
          }

          if (kanaSubject.specialKanaExplanation != null) {
            kanaSubjectInfoToDisplay.push(
              <SubjectsSubInfoSection subheader='Explanation' key='Explanation' isLastSubsection={true}>
                <>
                  {kanaSubject.specialKanaExplanation.length > 0 && <SpecialKanaExplanation explanation={kanaSubject.specialKanaExplanation} />}
                </>
              </SubjectsSubInfoSection>
            )
          }

          return {
            subjectText: kanaSubject.character,
            subjectMainDescription: kanaSubject.reading,
            subjectType: KANA_TYPE,
            subjectInfoToDisplay: [
              {
                header: 'Main',
                content: kanaSubjectInfoToDisplay
              }
            ],
            audioFiles: [kanaSubject.audioFile]
          }
        
        case RADICAL_TYPE:
          const radicalSubject = subject as RadicalSubject
          const kanjiThatUseThisRadical = radicalSubject.kanjiThatUsesThis
          .filter((subject) => !subject.meanings[0].includes('Radical'))
          .slice(0, 10)
          .map((subject) => ({ ...subject, type: KANJI_TYPE }))
  
          return {
            subjectText: radicalSubject.character,
            subjectMainDescription: radicalSubject.meaning.includes('katakana') ? `${radicalSubject.meaning}, ${radicalSubject.meaning.split('katakana').join('').trim()}` : radicalSubject.meaning,
            subjectType: RADICAL_TYPE,
            subjectInfoToDisplay: [
              {
                header: 'Name',
                  content: [
                    (
                      <SubjectsSubInfoSection subheader='Mnemonic' key='Mnemonic'>
                        {/* <div className='list-of-other-japanese-subjects'> */}
                        <div>
                          {
                            radicalSubject.mnemonicExplanation.length > 0 ? 
                            parseHtmlString(radicalSubject.mnemonicExplanation) : 
                            'No mnemonic exists for this radical yet'
                          }
                        </div>
                        {/* </div> */}
                      </SubjectsSubInfoSection>
                    )
                  ]
              },
              {
                header: 'Examples',
                  content: [
                    (
                      <SubjectsSubInfoSection subheader='Some Kanji That Use This Radical' key='Some Kanji That Use This Radical' isLastSubsection={true}>
                        <JapaneseExamplesAndContainedSubjects 
                          subjects={kanjiThatUseThisRadical} 
                        />
                      </SubjectsSubInfoSection>
                    )
                  ]
              }
            ]
          }
    
        case KANJI_TYPE:
          const kanjiSubject = subject as KanjiSubject
          const {
            kanjiContainedWithinThis,
            radicalsUsed,
            meaningMnemonic: kanjiMeaningMnemonic,
            meanings,
            onyomi,
            kunyomi,
            mainMeaningsToUse: mainMeaningsToUseForKanji
          } = kanjiSubject
  
          const kanjiConsistsOfOtherComponents = radicalsUsed.length + kanjiContainedWithinThis.length > 0
          // @ts-ignore
          const radicalMeaningsRemoved = meanings.filter(meaning => {
            return !meaning.includes('Radical')
          })
          const mainMeaningsRemoved = radicalMeaningsRemoved.filter(meaning => !mainMeaningsToUseForKanji.map(temp => temp.toLowerCase()).includes(meaning.toLowerCase()))

          const kanjiMeaningMnemonicComponent = (isLastSubsection: boolean) => (
            <SubjectsSubInfoSection subheader='Meaning Mnemonic' key='Meaning Mnemonic' isLastSubsection={isLastSubsection}>
              {kanjiMeaningMnemonic.length > 0 ? parseHtmlString(kanjiMeaningMnemonic) : <>No mnemonic exists for this kanji yet</>}
            </SubjectsSubInfoSection>
          )

          const kanjiMeaningSubjectContentForQuiz = [
            (<SubjectsSubInfoSection subheader='Meanings' key='Meanings'>
              <div>
                {mainMeaningsToUseForKanji.length > 0 ? 
                <>
                  <span className="bold-span">{mainMeaningsToUseForKanji.join(', ')}</span>
                  {mainMeaningsRemoved.length > 0 && <>, {mainMeaningsRemoved.join(', ')}</>}
                </> : (
                  <>
                    <span className="bold-span">{radicalMeaningsRemoved[0]}</span>
                    {radicalMeaningsRemoved.length > 1 && <>, {radicalMeaningsRemoved.slice(1).join(', ')}</> }
                  </>
                )}
              </div>
            </SubjectsSubInfoSection>),
            kanjiMeaningMnemonicComponent(true)
          ]

          const kanjiMeaningSubjectContentForLesson = [
            kanjiMeaningMnemonicComponent(false),
             radicalMeaningsRemoved.length > 1 ? (
                <SubjectsSubInfoSection subheader='Other Meanings' key='Other Meanings' isLastSubsection={true}>
                  {/* TODO: if i am using a custom main meaning, remove all those, if just teh first meaning, just remove the first meaning, line 285 */}
                  <div>{mainMeaningsToUseForKanji.length > 0 ? mainMeaningsRemoved.join(', ') : radicalMeaningsRemoved.slice(1).join(', ')}</div>
                </SubjectsSubInfoSection>
              ) : <Fragment key='blank'></Fragment>
          ]

          const getUniqueAndCleanReadings = (readings: string[]) => {
            const readingSet = new Set<string>()
            for (const reading of readings) {
              let modifiedReading = reading
              const dotIdx = modifiedReading.indexOf('.')
              if (dotIdx !== -1) {
                modifiedReading = modifiedReading.slice(0, dotIdx)
              }
              readingSet.add(modifiedReading.replace('-', ''))
            }
            return Array.from(readingSet)
          }

          const kanjiReadingsSubjectContent: JSX.Element[] = []
          if (onyomi.length > 0) {
            kanjiReadingsSubjectContent.push(
              <SubjectsSubInfoSection subheader='Onyomi' key='Onyomi'>
                <div>
                  {getUniqueAndCleanReadings(onyomi).map(reading => toKatakana(reading)).join(', ')}
                </div>
              </SubjectsSubInfoSection>
            )
          }

          if (kunyomi.length > 0) {
            kanjiReadingsSubjectContent.push(
              <SubjectsSubInfoSection subheader='Kunyomi' key='Kunyomi' isLastSubsection={true}>
                <div>
                  {getUniqueAndCleanReadings(kunyomi).join(', ')}
                </div>
              </SubjectsSubInfoSection>
            )
          }

          const kanjiReadingsSubjectContentForLesson = {
            header: 'Readings',
            content: kanjiReadingsSubjectContent
          }

          const kanjiCompositionSubjectInfo = {
            header: 'Composition',
              content: [
                (
                  <SubjectsSubInfoSection subheader='Components' key='Components' isLastSubsection={true}>
                    {kanjiConsistsOfOtherComponents ? (
                      <div className='list-of-other-japanese-subjects'>
                        <JapaneseExamplesAndContainedSubjects 
                          subjects={radicalsUsed.map((subject) => ({ ...subject, type: RADICAL_TYPE }))} 
                        />
                        <JapaneseExamplesAndContainedSubjects 
                          subjects={kanjiContainedWithinThis.map((subject) => ({ ...subject, type: KANJI_TYPE }))} 
                        />
                      </div>
                    ) : (
                      <p>This kanji does not consist of any other components</p>
                    )}
                  </SubjectsSubInfoSection>
                )
              ]
          }
  
          return {
            subjectText: kanjiSubject.character,
            subjectMainDescription: mainMeaningsToUseForKanji.length > 0 ? mainMeaningsToUseForKanji.join(', ') : kanjiSubject.meanings[0],
            subjectType: KANJI_TYPE,
            subjectInfoToDisplay: isForQuiz ? [
                {
                  header: 'Meaning',
                  content: kanjiMeaningSubjectContentForQuiz
                },
                kanjiReadingsSubjectContentForLesson,
                kanjiCompositionSubjectInfo,
            ] : [
                kanjiCompositionSubjectInfo,
                {
                  header: 'Meaning',
                  content: kanjiMeaningSubjectContentForLesson
                },
                kanjiReadingsSubjectContentForLesson
            ]
          }

        case VOCABULARY_TYPE:
          const vocabularySubject = subject as JapaneseVocabularySubject
          const {
            jmdict,
            kanjiThatThisUses,
            meaningMnemonic: vocabMeaningMnemonic,
            mainMeaningsToUse: mainMeaningsToUseForVocab,
            mainTextRepresentation,
            readingMnemonic: vocabReadingMnemonic,
            audioFiles,
            counterWordInfo,
            differencesExplanations
          } = vocabularySubject
          // TODO: do something with this notes
          const { note } = subject
          const mainTextRepresentationExists = mainTextRepresentation != null && mainTextRepresentation.length > 0

          if (jmdict != null) {
            const {
              kanjiVocabulary,
              kanaVocabulary,
              sense
            } = jmdict

            const isAKanaWord = (sense[0].misc.includes('uk') || kanjiVocabulary.length === 0) && (!mainTextRepresentationExists || !/[\u4e00-\u9faf\u3400-\u4dbf]/.test(mainTextRepresentation))
            // const isAKanaWord = kanjiVocabulary.length === 0 || !kanjiVocabulary[0].common
            const mainVocabularyToUse = mainTextRepresentationExists ? mainTextRepresentation : (isAKanaWord ? kanaVocabulary[0].text : kanjiVocabulary[0].text)
            let usingCustomMainMeaning = mainMeaningsToUseForVocab.length > 0
            let mainMeaningToUse = usingCustomMainMeaning ? mainMeaningsToUseForVocab[0] : removeParenthesesContent(sense[0].gloss[0].text!) 

            const vocabularySubjectInfoToDisplay: SubjectInfoToDisplay[] = []
            if (!isAKanaWord) {
              const thisWordsKanji = kanjiThatThisUses.map(({character}) => character)
              const dataForKanjiInTheMainKanjiVersionOfTheWord = mainVocabularyToUse
              .split('')
              .filter(char => (
                thisWordsKanji.includes(char)
              )).map((kanji) => 
                (kanjiThatThisUses.filter(({character}) => character === kanji)[0])
              )

              vocabularySubjectInfoToDisplay.push({
                header: 'Composition',
                content: [
                  (
                    <SubjectsSubInfoSection subheader='Contained Kanji' key='Contained Kanji'>
                      <div className='list-of-other-japanese-subjects'>
                        <JapaneseExamplesAndContainedSubjects
                          subjects={dataForKanjiInTheMainKanjiVersionOfTheWord.map((data) => ({ ...data, type: KANJI_TYPE }))} 
                        />
                      </div>
                    </SubjectsSubInfoSection>
                  )
                ]
              })
            }
    
            const otherMeanings: string[][] = [[...mainMeaningsToUseForVocab]]
            for (let i=0; i<sense.length; ++i) {
              for (let j=0; j<sense[i].gloss.length; j++) {
                if (i >= otherMeanings.length) {
                  otherMeanings.push([])
                }
                const { misc } = sense[i]
                const { text } = sense[i].gloss[j]
                if (text && !mainMeaningsToUseForVocab.includes(text) && !misc.includes('vulg')) {
                  otherMeanings[i].push(text)
                }
              }
            }
    
            const vocabularySubjectInfoToDisplayMeaning: JSX.Element[] = []
            const vocabHasOneTypeOfOtherMeanings = otherMeanings.length > 0 && otherMeanings[0].length > 0
            const vocabHasMultipleTypesOfMeanings = otherMeanings.length > 1
            const vocabHasExplanationsForItsDifferencesWithRelatedWords = differencesExplanations.length > 0
            vocabularySubjectInfoToDisplayMeaning.push((
              <SubjectsSubInfoSection subheader='Meaning Mnemonic' key='Meaning Mnemonic' isLastSubsection={!vocabHasOneTypeOfOtherMeanings && !vocabHasMultipleTypesOfMeanings}>
                <div>
                  {vocabMeaningMnemonic.length > 0 ? parseHtmlString(vocabMeaningMnemonic) : 'There is no meaning mnemonic for this yet'}
                </div>
              </SubjectsSubInfoSection>
            ))
            
            if (vocabHasOneTypeOfOtherMeanings) {
              vocabularySubjectInfoToDisplayMeaning.push(
                <SubjectsSubInfoSection subheader='Common Meanings' key='Other Common Meanings' isLastSubsection={!vocabHasMultipleTypesOfMeanings && !vocabHasExplanationsForItsDifferencesWithRelatedWords}>
                  <div>
                    <span style={{fontWeight: 'bold'}}>{otherMeanings[0][0]}</span> {otherMeanings[0].length > 1 ? (`, ${otherMeanings[0].slice(1).join(', ')}`) : ''}
                  </div>
                </SubjectsSubInfoSection>
              )
    
              if (vocabHasMultipleTypesOfMeanings) {
                vocabularySubjectInfoToDisplayMeaning.push(
                  <SubjectsSubInfoSection subheader='Less Common Meanings' key='Less Common Meanings' isLastSubsection={differencesExplanations.length > 0}>
                    <div>
                      {otherMeanings.slice(1).map((meanings, idx) => (
                        <div>
                          <span>{idx + 1}</span>. <span>{meanings.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </SubjectsSubInfoSection>
                )
              }
            }

            if (vocabHasExplanationsForItsDifferencesWithRelatedWords) {
              vocabularySubjectInfoToDisplayMeaning.push(
                <SubjectsSubInfoSection subheader='Difference with Related Words' key='Difference with Related Words' isLastSubsection={true}>
                      <div>
                        {differencesExplanations.map(({
                            mainMeaningsToUse,
                            mainTextRepresentation,
                            differenceFromPerspectiveOfFirstSubject,
                            differenceFromPerspectiveOfSecondSubject,
                            generalDifference
                          }) => {
                            let explanation = generalDifference
                            const differenceFromPerspectiveOfFirstSubjectIfExists = (differenceFromPerspectiveOfFirstSubject != null && differenceFromPerspectiveOfFirstSubject.length > 0) ? differenceFromPerspectiveOfFirstSubject : generalDifference
                            const differenceFromPerspectiveOfSecondSubjectIfExists = (differenceFromPerspectiveOfSecondSubject != null && differenceFromPerspectiveOfSecondSubject.length > 0) ? differenceFromPerspectiveOfSecondSubject : generalDifference
                            // TODO: implement logic to get differnece explanation from first or second subject persepctive
                            // if (subjectUserIsLearningIsTheFirstSubject) {
                            //   subjectsDifferenceInfo.text = secondSubject.mainTextRepresentation
                            //   subjectsDifferenceInfo.explanation = differenceFromPerspectiveOfSecondSubjectIfExists!
                            // } else {
                            //   subjectsDifferenceInfo.text = firstSubject.mainTextRepresentation
                            //   subjectsDifferenceInfo.explanation = differenceFromPerspectiveOfFirstSubjectIfExists!
                            // }

                            return (
                                <DifferenceExplanation mainTextRepresentation={mainTextRepresentation} explanation={explanation!} />
                            )
                          })
                        }
                      </div>
                </SubjectsSubInfoSection>
              )
            }
    
            vocabularySubjectInfoToDisplay.push({
              header: 'Meaning',
              content: vocabularySubjectInfoToDisplayMeaning
            })

            const vocabularySubjectInfoReadingContent: JSX.Element[] = []
            const commonKanaRepresentations = kanaVocabulary.filter(({common}) => common).map(({text}) => text)
            if (audioFiles.length > 0) {
              vocabularySubjectInfoReadingContent.push((
                <SubjectsSubInfoAudioSection key='Pronunciation' audioFiles={audioFiles} characters={commonKanaRepresentations.length > 0 ? commonKanaRepresentations : [kanaVocabulary[0].text]}/>
              ))
            }

            if (!isAKanaWord) {
              vocabularySubjectInfoReadingContent.push(
                ...[
                  (
                    <SubjectsSubInfoSection subheader='Reading' key='Reading'>
                      <span className='bold-span'>
                        {kanaVocabulary.filter(({common}) => common).map(({text}) => text).join(', ')}
                        {/* kanaVocabulary[0].text */}
                      </span>
                    </SubjectsSubInfoSection>
                  ),
                  (
                    <SubjectsSubInfoSection subheader='Reading Mnemonic' key='Reading Mnemonic' isLastSubsection={true}>
                      <>
                        {vocabReadingMnemonic.length > 0 ? parseHtmlString(vocabReadingMnemonic) : 'There is no reading mnemonic for this yet'}
                      </>
                        
                    </SubjectsSubInfoSection>
                  )
                ]
              )
            }
            
            if (vocabularySubjectInfoReadingContent.length > 0) {
              vocabularySubjectInfoToDisplay.push({
                header: 'Reading',
                content: vocabularySubjectInfoReadingContent
              })
            }

            return {
              subjectText: mainVocabularyToUse,
              subjectMainDescription: mainMeaningToUse!,
              subjectType: VOCABULARY_TYPE,
              subjectInfoToDisplay: vocabularySubjectInfoToDisplay,
              audioFiles: audioFiles.map(({file}) => file)
            }
          } else {
            // is counter info
            const {
              character,
              usage,
              howToAskForHowMany,
              objectsThisIsUsedToCount,
              specialNumbers,
              normalReading
            } = counterWordInfo!

            const counterWordSubjectInfo: {header: string, content: JSX.Element[]}[] = []
            if (kanjiThatThisUses.length > 0) {
              counterWordSubjectInfo.push({
                header: 'Composition',
                content: [
                  (
                    <SubjectsSubInfoSection subheader='Contained Kanji' key='Composition' isLastSubsection={true}>
                      <div className='list-of-other-japanese-subjects'>
                        {isKana(character)}
                        <JapaneseExamplesAndContainedSubjects
                          subjects={kanjiThatThisUses.map((data) => ({ ...data, type: KANJI_TYPE }))} 
                        />
                      </div>
                    </SubjectsSubInfoSection>
                  )
                ]
              })
            }

            let counterWordTextForSubject = mainTextRepresentation
            let counterWordReadingForSubject = ''
            let isASpecialCountNumber = false
            let isTheHowMuchVersion = false
            if (mainTextRepresentation.includes(' ')) {
              const [kanjiVersion, hiraganaVersion] = mainTextRepresentation.split(' ')
              if (kanjiVersion === howToAskForHowMany.characters) {
                counterWordTextForSubject = character === 'つ' ? howToAskForHowMany.reading : howToAskForHowMany.characters
                counterWordReadingForSubject = howToAskForHowMany.reading
                isTheHowMuchVersion = true
              } else {
                isASpecialCountNumber = true
                counterWordTextForSubject = kanjiVersion
                counterWordReadingForSubject = hiraganaVersion.slice(1, -1)
              }
            }

            const specialNumberToReading = specialNumbers.reduce((accumulator, {number, reading, explanation}) => (
              {
                ...accumulator,
                [number]: {
                  reading,
                  explanation
                }
              }
            ), {} as {[number: string]: {reading: string, explanation?: string}})

            const CounterWordRow = ({word, reading, explanation, bold}: {word: string, reading: string, explanation?: string, bold: boolean}) => {
              return (
                <div className='counter-word-row'>
                  <div className={`counter-word-row-text ${bold ? 'counter-word-row-text-bold' : ''}`}>
                    <div className='counter-word-row-kanji'>{word}</div>
                    <div>{reading}</div>
                  </div>
                  <div>{explanation}</div>
                </div>
              )
            }

            const counterWordNumbersChart: JSX.Element[] = []

            const numberLimit = character === '日' ? '二十' : '十'
            for (const number of Object.keys(KANJI_TO_NUMBER)) {
              const word = number === '十' && character === 'つ' ? `${number}` : `${number}${character}`
              const bold = number === (counterWordTextForSubject.length > 1 ? counterWordTextForSubject.slice(0, -1) : counterWordTextForSubject)
              const numbersHiragana = KANJI_TO_NUMBER[number as keyof typeof KANJI_TO_NUMBER].hiragana
              if (specialNumberToReading.hasOwnProperty(number)) {
                counterWordNumbersChart.push(
                  <CounterWordRow 
                    word={word} 
                    key={word}
                    reading={specialNumberToReading[number].reading} 
                    explanation={specialNumberToReading[number].explanation} 
                    bold={bold}
                  />
                )
              } else {
                counterWordNumbersChart.push(
                  <CounterWordRow 
                    word={word} 
                    key={word}
                    reading={numbersHiragana.includes(',') ? `${numbersHiragana.split(',')[0]}${normalReading}/${numbersHiragana.split(',')[1]}${normalReading}` : `${numbersHiragana}${normalReading}`} 
                    bold={bold}
                  />
                )
              }
              if (number === numberLimit) {
                break
              }
            }

            if (isTheHowMuchVersion) {
              counterWordNumbersChart.unshift(
                <CounterWordRow 
                  word={howToAskForHowMany.characters} 
                  key={howToAskForHowMany.characters}
                  reading={howToAskForHowMany.reading} 
                  bold={isTheHowMuchVersion}
                />
              )
            } else {
              counterWordNumbersChart.push(
                <CounterWordRow 
                  word={howToAskForHowMany.characters} 
                  key={howToAskForHowMany.characters}
                  reading={howToAskForHowMany.reading} 
                  bold={isTheHowMuchVersion}
                />
              )
            }

            const readingTheCounterUses = specialNumbers.length > 0 ? (
              `The counter generally uses ${normalReading} as the reading however there are some exceptions.`
            ) : (
              `The counter uses ${normalReading} as the reading.`
            )
              
            counterWordSubjectInfo.push({
              header: 'Description',
              content: [
                (
                  <SubjectsSubInfoSection subheader='Usage' key='Usage'>
                    <div>
                      {character === 'つ' ? usage : `This is the ${usage} counter. ${readingTheCounterUses}`}
                      {character === 'つ' && (
                        <>
                          <br />
                          <br />
                          <div style={{fontWeight: 'bold'}}>Specific Examples:</div>
                          <ul>
                            {objectsThisIsUsedToCount.slice(3).map(({ plural })=> (
                              <li style={{textTransform: 'capitalize'}}>{plural}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </SubjectsSubInfoSection>
                ),
                (
                  <SubjectsSubInfoSection subheader='Chart' key='Chart' isLastSubsection={true}>
                    <div className='counter-word-numbers-chart'>
                      {counterWordNumbersChart}
                    </div>
                  </SubjectsSubInfoSection>
                )
              ]
            })

            if (counterWordReadingForSubject.length > 0) {
              counterWordSubjectInfo.push({
                header: 'Reading',
                content: [
                  (
                    <SubjectsSubInfoSection subheader='Reading' key='Reading' isLastSubsection={true}>
                      <span className='bold-span'>
                        {counterWordReadingForSubject}
                      </span>
                    </SubjectsSubInfoSection>
                  )
                ]
              })
            }

            let counterWordMainDescription = mainMeaningsToUseForVocab[0]
            if (isTheHowMuchVersion) {
              counterWordMainDescription = 'How many'
            } else if (isASpecialCountNumber) {
              counterWordMainDescription = `${KANJI_TO_NUMBER[(counterWordTextForSubject.length > 1 ? counterWordTextForSubject.slice(0, -1) : counterWordTextForSubject) as keyof typeof KANJI_TO_NUMBER].number}`
            }

            return {
              subjectText: counterWordTextForSubject,
              subjectMainDescription: counterWordMainDescription,
              subjectType: VOCABULARY_TYPE,
              subjectInfoToDisplay: counterWordSubjectInfo,
              audioFiles: audioFiles.map(({file}) => file)
            }
          }
  
        case EXERCISE_TYPE:
          const exerciseSubject = subject as JapaneseExerciseSubject
          return {
            subjectText: exerciseSubject.questionToAsk,
            subjectMainDescription: exerciseSubject.answers[0],
            subjectType: VOCABULARY_TYPE,
            subjectInfoToDisplay: exerciseSubject.infoToDisplay,
          }

        case GRAMMAR_TYPE:
          const grammarSubject = subject as GrammarSubject
          const {
            nameForPresentation,
            description: formalityDescription
          } = GrammarFormalityAndDescriptions[grammarSubject.formality]
          const grammarPointInfo = isForQuiz ? [
            (
              <SubjectsSubInfoSection subheader='Grammar Point' key='Grammar Point'>
                <span className='bold-span'>{grammarSubject.name}</span>
              </SubjectsSubInfoSection>
            )
          ] : []

          return {
            subjectText: grammarSubject.name,
            subjectMainDescription: grammarSubject.meaning,
            subjectType: GRAMMAR_TYPE,
            subjectInfoToDisplay: [
              {
                header: 'Meaning',
                  content: [
                    ...grammarPointInfo,
                    (
                      <SubjectsSubInfoSection subheader='Meaning' key='Meaning'>
                        <>{grammarSubject.meaning}</>
                      </SubjectsSubInfoSection>
                    ),
                    (grammarSubject.structure.length > 0 ? (
                      <SubjectsSubInfoSection subheader='Structure' key='Structure'>
                        <>{grammarSubject.structure.split(', ').map((structure, idx) => {
                          return (
                            <div key={structure}>
                              {idx + 1}. <span>{structure}</span>
                            </div>
                          )
                        })}</>
                      </SubjectsSubInfoSection>
                    ) : <></>),
                    (
                      <SubjectsSubInfoSection subheader='Formality' key='Formality' isLastSubsection={true}>
                        <p>
                          {nameForPresentation} - {formalityDescription}
                        </p>
                      </SubjectsSubInfoSection>
                    )
                  ]
              },
              {
                header: 'Explanation',
                  content: [
                    (
                      <SubjectsSubInfoSection subheader='Explanation' key='Explanation' isLastSubsection={true}>
                        <div className='grammar-subject-explanation'>
                          {grammarSubject.explanation.split('<newline />').map(str => {
                            return <p key={str}>{str}</p>
                          })}
                        </div>
                      </SubjectsSubInfoSection>
                    )
                  ]
              },
              {
                header: 'Examples',
                  content: [
                    (
                      <SubjectsSubInfoSection subheader='Examples' key='Examples' isLastSubsection={true}>
                        <div>
                          {grammarSubject.examples.map(({ audioFile, exampleText, translations }) => {
                            return (
                              <div key={exampleText}>
                                <p style={{fontWeight: 'bold'}}>{exampleText}</p>
                                {parseHtmlString(translations[0].translation)}
                              </div>
                            )
                          })}
                        </div>
                      </SubjectsSubInfoSection>
                    )
                  ]
              }
            ]
          }
  
        
      }
    } else {
      switch (subject.subjectType) {
        case GRAMMAR_TYPE:
          const grammarSubject = subject as GrammarSubject
          const {
            nameForPresentation,
            description: formalityDescription
          } = GrammarFormalityAndDescriptions[grammarSubject.formality]

          return {
            subjectText: grammarSubject.name,
            subjectMainDescription: grammarSubject.meaning,
            subjectType: GRAMMAR_TYPE,
            subjectInfoToDisplay: [
              {
                header: 'Meaning',
                  content: [
                    (
                      <SubjectsSubInfoSection subheader='Meaning' key='Meaning'>
                        <>{grammarSubject.meaning}</>
                      </SubjectsSubInfoSection>
                    ),
                    (
                      <SubjectsSubInfoSection subheader='Structure' key='Structure'>
                        <>{grammarSubject.structure.split(', ').map((structure, idx) => {
                          return (
                            <div key={structure}>
                              {idx + 1}. <span>{structure}</span>
                            </div>
                          )
                        })}</>
                      </SubjectsSubInfoSection>
                    ),
                    (
                      <SubjectsSubInfoSection subheader='Formality' key='Formality' isLastSubsection={true}>
                        <p>
                          {nameForPresentation} - {formalityDescription}
                        </p>
                      </SubjectsSubInfoSection>
                    )
                  ]
              },
              {
                header: 'Explanation',
                  content: [
                    (
                      <SubjectsSubInfoSection subheader='Explanation' key='Explanation' isLastSubsection={true}>
                        <div className='grammar-subject-explanation'>
                          {grammarSubject.explanation.split('<newline />').map(str => {
                            return <p key={str}>{str}</p>
                          })}
                        </div>
                      </SubjectsSubInfoSection>
                    )
                  ]
              },
              {
                header: 'Examples',
                  content: [
                    (
                      <SubjectsSubInfoSection subheader='Examples' key='Examples' isLastSubsection={true}>
                        <div>
                          {grammarSubject.examples.map(({ audioFile, exampleText, translations }) => {
                            return (
                              <div key={exampleText}>
                                <p style={{fontWeight: 'bold'}}>{exampleText}</p>
                                {parseHtmlString(translations[0].translation)}
                              </div>
                            )
                          })}
                        </div>
                      </SubjectsSubInfoSection>
                    )
                  ]
              }
            ]
          }
      }
    }
  // todo: for the ones iwthout japanese subject type, handle
    
  
    return defaultSubjectPresenterProps
}

interface SubjectsSubInfoProps {
  subjectInfo: SubjectInfoToDisplay[]
  contentToDisplay: string
  setContentToDisplay(content: string): void
}

export const SubjectsSubInfo = ({
    subjectInfo,
    contentToDisplay,
    setContentToDisplay
}: SubjectsSubInfoProps) => {
    const [subjectInfoHeaderAndContentObj, setSubjectInfoHeaderAndContentObj] = useState<{[header: string]: FC<SubjectsSubInfoSectionProps>}>({})
    useEffect(() => {
      setContentToDisplay(subjectInfo.length > 0 ? subjectInfo[0].header : '')
      setSubjectInfoHeaderAndContentObj(subjectInfo.reduce((accumulator, {header, content}) => ({...accumulator, [header]: content}), {}))
    }, [subjectInfo, setContentToDisplay])

    return (
        <div className='subject-presenter-sections'>
            <div className='subject-presenter-sections-headers-container'>
                {
                    subjectInfo.map(({header}) => (
                        <h2 
                            className={`subject-presenter-sections-header ${contentToDisplay === header ? 'subject-presenter-selected-header' : ''}`}
                            key={header}
                            onClick={() => setContentToDisplay(header)}
                        >
                            {header}
                        </h2>
                    )
                )}
            </div>
            {contentToDisplay !== '' && subjectInfoHeaderAndContentObj[contentToDisplay]}
        </div>
    )
}