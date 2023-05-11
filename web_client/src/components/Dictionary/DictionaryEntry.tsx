import { JMDict, JMDictSense } from '../learning/lessons/SubjectTypes'
import './DictionaryEntry.scss'

const JLPT_LEVEL = 'jlpt'
const LANGOBEE_LEVEL = 'level'
const COMMON = 'common'

interface WordTagsProps {
    tagType: typeof JLPT_LEVEL | typeof LANGOBEE_LEVEL | typeof COMMON
    text: string | number
}

const WordTags = ({
    tagType,
    text
}: WordTagsProps) => {
    const tagToClassName = {
        [LANGOBEE_LEVEL]: 'langobee-level-tag',
        [JLPT_LEVEL]: 'jlpt-level-tag',
        [COMMON]: 'common-tag'
    } as const

    return (
        <div className={`dictionary-word-tag ${tagToClassName[tagType]}`}>
            {tagType} {tagType !== COMMON ? text : ''}
        </div>
    )
}

interface DictionaryMeaningProps {
    senseInfo: JMDictSense
    index: number
}

const DicitionaryMeaning = ({
    senseInfo: {
        gloss,
        partOfSpeech,
        appliesToKanji,
        appliesToKana
    },
    index
}: DictionaryMeaningProps) => {
    return (
        <div className='dictionary-meaning'>
            <span className='dictionary-part-of-speech'>{partOfSpeech.join(', ')}</span>
            <div>
                <span className='meaning-number'>{index}. </span>{gloss.map(({text}) => text).join('; ')}
            </div>
        </div>
    )
}

export type JmdictAndLevels =  { jmdict: JMDict, jlptLevel: number | null, courseLevel: {number: number} | null}

export const DictionaryEntry = ({
    jmdict: {
        kanjiVocabulary,
        kanaVocabulary,
        sense,
    },
    jlptLevel,
    courseLevel,
}: JmdictAndLevels) => {
    const wordIsMainlyKanji = kanjiVocabulary.length > 0 && kanjiVocabulary[0].common
    const wordsLength = (kanjiVocabulary.length > 0 ? kanjiVocabulary[0].text : kanaVocabulary[0].text).length
    const isACommonWord = wordIsMainlyKanji || kanaVocabulary[0].common

    return (
        <div className={`dictionary-entry ${wordsLength >= 5 ? 'dictionary-entry-for-long-word' : 'dictionary-entry-for-short-word'}`}>
            <div className='dictionary-entry-word'>
                <div>
                    {kanjiVocabulary.length > 0 ? (
                        <>
                            {wordIsMainlyKanji && <span>{kanaVocabulary[0].text}</span>}
                            <h1>{kanjiVocabulary[0].text}</h1>
                        </>
                    ) : (
                        <>
                            <h1>{kanaVocabulary[0].text}</h1>
                        </>
                    )}
                </div>
                
                
                <div className='dictionary-tags-container'>
                    {courseLevel != null && <WordTags tagType={LANGOBEE_LEVEL} text={courseLevel.number} />}
                    {jlptLevel != null && <WordTags tagType={JLPT_LEVEL} text={jlptLevel} />}
                    {isACommonWord && (
                        <WordTags tagType={COMMON} text={COMMON} />
                    )}
                </div>
                
            </div>
            
            <div className='dictionary-sense-information'>
                <ul>
                    {sense.map((senseInfo, i) => <DicitionaryMeaning key={i + 1} index={i + 1} senseInfo={senseInfo} />)}
                </ul>
            </div>
        </div>
    )
}
