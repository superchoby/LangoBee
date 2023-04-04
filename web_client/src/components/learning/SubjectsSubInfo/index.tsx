import { useEffect, useState, FC, useMemo } from "react"
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
    isAHiraganaChar,
    isAKatakanaChar,
    GrammarFormalityAndDescriptions,
    JapaneseVocabularySubjectAudioFiles,
} from '../lessons/SubjectTypes'
import { toKatakana } from 'wanakana'
import { HiSpeakerWave } from 'react-icons/hi2'
import './index.scss' 

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

const HIGH_PITCH = 'high'
const LOW_PITCH = 'low'

interface SubjectsSubInfoAudioSectionProps {
  isLastSubsection?: boolean
  audioFiles: JapaneseVocabularySubjectAudioFiles[]
  characters: string[]
}

const SubjectsSubInfoAudioSection = ({
  isLastSubsection,
  audioFiles,
  characters
}: SubjectsSubInfoAudioSectionProps) => {
  const pronunciationComponents = useMemo(() => {
    const pronunciationComponents: JSX.Element[] = []
    for (let i=0; i<audioFiles.length; ++i) {
      const { file, lastHighPitch } = audioFiles[i]
      let pitchGraph: JSX.Element[] = []
      let currentPitch: typeof HIGH_PITCH | typeof LOW_PITCH = lastHighPitch === 1 ? HIGH_PITCH : LOW_PITCH
      let hasAlreadyGottenHigh = currentPitch === HIGH_PITCH
      for (let j=1; j<=characters[i].length; ++j) {
        // let className = currentPitch === LOW_PITCH ? 'pitch-breakdown-low' : 'pitch-breakdown-high'
        let className = ''
        if (currentPitch === LOW_PITCH) {
          className = 'pitch-breakdown-low'
          if (!hasAlreadyGottenHigh) {
            className += ' pitch-breakdown-low-to-high'
            currentPitch = HIGH_PITCH
            hasAlreadyGottenHigh = true
          }
        } else {
          className = 'pitch-breakdown-high'
          if (j === lastHighPitch) {
            className += ' pitch-breakdown-high-to-low'
            currentPitch = LOW_PITCH
          }
        }

        pitchGraph.push(<span className={className} key={j}>{characters[i][j-1]}</span>)
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
    audioFile?: string
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
                  {kanaSubject.specialKanaExplanation.length > 0 && parseHtmlString(kanaSubject.specialKanaExplanation)}
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
            audioFile: kanaSubject.audioFile
          }
        
        case RADICAL_TYPE:
          const radicalSubject = subject as RadicalSubject
          const kanjiThatUseThisRadical = radicalSubject.kanjiThatUsesThis
          .filter((subject) => !subject.meanings[0].includes('Radical'))
          .slice(0, 10)
          .map((subject) => ({ ...subject, type: KANJI_TYPE }))
  
          return {
            subjectText: radicalSubject.character,
            subjectMainDescription: radicalSubject.meaning,
            subjectType: RADICAL_TYPE,
            subjectInfoToDisplay: [
              {
                header: 'Name',
                  content: [
                    (
                      <SubjectsSubInfoSection subheader='Mnemonic' key='Mnemonic'>
                        {/* <div className='list-of-other-japanese-subjects'> */}
                        <div>
                          {parseHtmlString(radicalSubject.mnemonicExplanation)}
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
          const kunyomiWithOkuriganaRemoved = kunyomi.map(reading => {
            const dotIdx = reading.indexOf('.')
            if (dotIdx !== -1) {
              return reading.slice(0, dotIdx)
            }
            return reading
          })
          // @ts-ignore
          const onlyUniqueKunyomi = [...(new Set(kunyomiWithOkuriganaRemoved))]
          const radicalMeaningsRemoved = meanings.filter(meaning => {
            return !meaning.includes('Radical')
          })
          const mainMeaningsRemoved = radicalMeaningsRemoved.filter(meaning => !mainMeaningsToUseForKanji.map(temp => temp.toLowerCase()).includes(meaning.toLowerCase()))

          const kanjiMeaningMnemonicComponent = (isLastSubsection: boolean) => (
            <SubjectsSubInfoSection subheader='Meaning Mnemonic' key='Meaning Mnemonic' isLastSubsection={isLastSubsection}>
              {kanjiMeaningMnemonic.length > 0 ? parseHtmlString(kanjiMeaningMnemonic) : <>No mnemonic yet</>}
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
              ) : <></>
          ]
          const kanjiReadingsSubjectContentForLesson = {
            header: 'Readings',
              content: [
                (
                  <SubjectsSubInfoSection subheader='Onyomi' key='Onyomi'>
                    <div>
                      {onyomi.map(reading => toKatakana(reading)).join(', ')}
                    </div>
                  </SubjectsSubInfoSection>
                ),
                (
                  <SubjectsSubInfoSection subheader='Kunyomi' key='Kunyomi' isLastSubsection={true}>
                    <div>
                      {onlyUniqueKunyomi.join(', ')}
                    </div>
                  </SubjectsSubInfoSection>
                )
              ]
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
            jmdict: {
              kanjiVocabulary,
              kanaVocabulary,
              sense,
              jmDictId
            },
            kanjiThatThisUses,
            meaningMnemonic: vocabMeaningMnemonic,
            mainMeaningsToUse: mainMeaningsToUseForVocab,
            mainTextRepresentation,
            readingMnemonic: vocabReadingMnemonic,
            audioFiles
          } = vocabularySubject
          const mainTextRepresentationExists = mainTextRepresentation != null && mainTextRepresentation.length > 0
          const isAKanaWord = sense[0].misc.includes('uk') || kanjiVocabulary.length === 0
          const mainVocabularyToUse = mainTextRepresentationExists ? mainTextRepresentation : (isAKanaWord ? kanaVocabulary[0].text : kanjiVocabulary[0].text)
          let mainMeaningToUse = (mainMeaningsToUseForVocab.length > 0 ? mainMeaningsToUseForVocab[0] : sense[0].gloss[0].text)! 
          const openingParenIdx = mainMeaningToUse.indexOf('(')
          const closingParenIdx = mainMeaningToUse.indexOf(')')
          if (openingParenIdx !== -1 && closingParenIdx !== -1) {
            mainMeaningToUse = (mainMeaningToUse.substring(0, openingParenIdx) + mainMeaningToUse.substring(closingParenIdx + 1)).trim()
          }          
          const vocabularySubjectInfoToDisplay: SubjectInfoToDisplay[] = []
          if (!isAKanaWord) {
            const dataForKanjiInThisWord = mainVocabularyToUse
            .split('')
            .filter(char => (
              !isAHiraganaChar(char) && !isAKatakanaChar(char)
            )).map((kanji) => 
              (kanjiThatThisUses.filter(({character}) => character === kanji)[0])
            )
            vocabularySubjectInfoToDisplay.push({
              header: 'Composition',
              content: [
                (
                  <SubjectsSubInfoSection subheader='Contained Kanji' key='Composition'>
                    <div className='list-of-other-japanese-subjects'>
                      <JapaneseExamplesAndContainedSubjects
                        subjects={dataForKanjiInThisWord.map((data) => ({ ...data, type: KANJI_TYPE }))} 
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
          vocabularySubjectInfoToDisplayMeaning.push((
            <SubjectsSubInfoSection subheader='Meaning Mnemonic' key='Meaning Mnemonic' isLastSubsection={!vocabHasOneTypeOfOtherMeanings && !vocabHasMultipleTypesOfMeanings}>
              <div>
                {vocabMeaningMnemonic.length > 0 ? parseHtmlString(vocabMeaningMnemonic) : 'There is no meaning mnemonic for this yet'}
              </div>
            </SubjectsSubInfoSection>
          ))
          
          if (vocabHasOneTypeOfOtherMeanings) {
            vocabularySubjectInfoToDisplayMeaning.push(
              <SubjectsSubInfoSection subheader='Common Meanings' key='Other Common Meanings' isLastSubsection={!vocabHasMultipleTypesOfMeanings}>
                <div>
                  <span style={{fontWeight: 'bold'}}>{otherMeanings[0][0]}</span> {otherMeanings[0].length > 1 ? (`, ${otherMeanings[0].slice(1).join(', ')}`) : ''}
                </div>
              </SubjectsSubInfoSection>
            )
  
            if (vocabHasMultipleTypesOfMeanings) {
              vocabularySubjectInfoToDisplayMeaning.push(
                <SubjectsSubInfoSection subheader='Less Common Meanings' key='Less Common Meanings' isLastSubsection={true}>
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
  
          vocabularySubjectInfoToDisplay.push({
            header: 'Meaning',
            content: vocabularySubjectInfoToDisplayMeaning
          })

          const vocabularySubjectInfoReadingContent: JSX.Element[] = []
          if (audioFiles.length > 0) {
            vocabularySubjectInfoReadingContent.push((
              <SubjectsSubInfoAudioSection key='Pronunciation' audioFiles={audioFiles} characters={kanaVocabulary.filter(({common}) => common).map(({text}) => text)}/>
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
            audioFile: audioFiles.length > 0 ? audioFiles[0].file : ''
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