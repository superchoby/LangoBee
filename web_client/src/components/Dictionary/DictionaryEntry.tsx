import { useState } from 'react'
import { JMDict, JMDictSense, KanjiSubject } from '../learning/lessons/SubjectTypes'
import { cleanKanjiReadings } from '../shared/cleanKanjiReadings'
import { toKatakana, toRomaji } from 'wanakana'
import { useFetchStatus } from '../shared/useFetchStatus'
import { PulseLoader } from 'react-spinners'
import { useUserIsAuthenticated } from '../shared/useUserIsAuthenticated'
import './DictionaryEntry.scss'

export const JLPT_LEVEL = 'jlpt'
export const LANGOBEE_LEVEL = 'level'
export const COMMON = 'common'


export interface AddToReviewButtonProps {
    className?: string
    dataToAddToReview: {
        subject_type: 'vocabulary'
        jmdict_id: number
    } | {
        subject_type: 'kanji'
        kanji_character: string
    }
}

export const ADD_TO_REVIEW_BUTTON_MESSAGES = {
    join: 'Join to Study this Subject!',
    add: 'Add To Reviews',
    alreadyInReviews: 'Already in your Reviews',
    finished: 'Finished Adding!',
    error: 'Error, please try later'
}

export const AddToReviewButton = ({
    className = '',
    dataToAddToReview
}: AddToReviewButtonProps) => {
    const [userAlreadyKnowsThis, changeUserAlreadyKnowsThis] = useState(false)
    const { userIsAuthenticated } = useUserIsAuthenticated()
    const [unauthenticatedUserTriedToAddThis, changeUnauthenticatedUserTriedToAddThis] = useState(false)
    const { 
        fetchData, 
        isFetching, 
        isSuccess, 
        isIdle 
    } = useFetchStatus<{user_already_has_this_in_reviews: boolean}>(
        'subjects/add_dictionary_entry_to_review/', 
        'post',
        (data) => changeUserAlreadyKnowsThis(data.user_already_has_this_in_reviews)
    );

    const addToReviews = () => {
        fetchData(dataToAddToReview)
    }

    const {
        join,
        add,
        alreadyInReviews,
        finished,
        error,
    } = ADD_TO_REVIEW_BUTTON_MESSAGES
   
    return (
        <button 
            className={`dictionary-add-to-review-button ${className} ${isIdle ? '' : 'dictionary-add-to-review-button-non-clickable'}`}
            onClick={() => { 
                if (userIsAuthenticated && isIdle) {
                    addToReviews()
                } else if (!userIsAuthenticated) {
                    changeUnauthenticatedUserTriedToAddThis(true)
                }
            }}
        >
            {(() => {
                if (unauthenticatedUserTriedToAddThis) {
                    return join
                } else if (isIdle) {
                    return add
                } else if (isFetching) {
                    return <PulseLoader size={4} color='#3A3A3A' />
                } else if (isSuccess) {
                    return userAlreadyKnowsThis ? alreadyInReviews : finished
                } else {
                    return error
                }
            })()}
        </button>
    )
}

interface WordTagsProps {
    tagType: typeof JLPT_LEVEL | typeof LANGOBEE_LEVEL | typeof COMMON
    text: string | number
}

const tagToClassName = {
    [LANGOBEE_LEVEL]: 'langobee-level-tag',
    [JLPT_LEVEL]: 'jlpt-level-tag',
    [COMMON]: 'common-tag'
} as const

export const WordTags = ({
    tagType,
    text
}: WordTagsProps) => {
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

const VocabularyDictionaryMeaning = ({
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
                <span className='meaning-number'>{index}. </span>
                {gloss.map(({text}) => text).join('; ')}
            </div>
        </div>
    )
}

export type JmdictAndLevels =  { jmdict: JMDict, jlptLevel: number | null, courseLevel: {number: number} | null}

export const VocabularyDictionaryEntry = ({
    jmdict: {
        kanjiVocabulary,
        kanaVocabulary,
        sense,
        jmDictId
    },
    jlptLevel,
    courseLevel,
}: JmdictAndLevels) => {
    const wordIsMainlyKanji = kanjiVocabulary.length > 0 && kanjiVocabulary[0].common
    const wordsLength = (kanjiVocabulary.length > 0 ? kanjiVocabulary[0].text : kanaVocabulary[0].text).length
    const isACommonWord = wordIsMainlyKanji || kanaVocabulary[0].common

    return (
        <div className={`dictionary-entry ${wordsLength >= 5 ? 'dictionary-entry-for-long-word' : 'dictionary-entry-for-short-word'}`}>
            <AddToReviewButton className='dictionary-add-to-reviews-for-vocab' dataToAddToReview={{subject_type: 'vocabulary', jmdict_id: jmDictId}} />
            <div className='dictionary-entry-word'>
                <div>
                    {kanjiVocabulary.length > 0 && <span className='dictionary-entry-words-main-representation'>{kanjiVocabulary[0].text}</span>}
                    <span className={`dictionary-entry-words-main-representation${kanjiVocabulary.length > 0 ? 's-reading' : ''}`}>
                        {kanaVocabulary[0].text}
                    </span>
                    <rt className='dictionary-entry-words-main-representations-reading-romaji'>{toRomaji(kanaVocabulary[0].text)}</rt>
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
                    {sense.map((senseInfo, i) => <VocabularyDictionaryMeaning key={i + 1} index={i + 1} senseInfo={senseInfo} />)}
                </ul>
            </div>
        </div>
    )
}

export const KanjiDictionaryEntry = ({
    character,
    kunyomi,
    onyomi,
    meanings
}: KanjiSubject) => {

    return (
        <div className=''>
            <AddToReviewButton 
                className='kanji-dictionary-entry-add-to-review-button' 
                dataToAddToReview={{subject_type: 'kanji', kanji_character: character}} 
            />
            <div className='kanji-dictionary-entry'>
                <div className='dictionary-kanji-character'>{character}</div>
                <div className='kanji-dictionary-entry-info'>
                    <div className='kanji-dictionary-entry-info-meanings'>{meanings.join(', ')}</div>
                    <div className='kanji-dictionary-entry-info-readings'>
                        <span>on:&nbsp;</span>{cleanKanjiReadings(onyomi).map(reading => toKatakana(reading)).join(', ')}
                    </div>
                    <div className='kanji-dictionary-entry-info-readings'>
                        <span>kun:&nbsp;</span>{cleanKanjiReadings(kunyomi).join(', ')}
                    </div>
                </div>   
            </div>
        </div>
    )
}
