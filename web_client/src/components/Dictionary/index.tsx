import { useFetchStatus } from '../shared/useFetchStatus'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
    VocabularyDictionaryEntry, 
    JmdictAndLevels,
    KanjiDictionaryEntry
} from './DictionaryEntry'
import { WaitingForDataToProcess } from '../shared/WaitingForDataToProcess'
import { JAPANESE_CHAR_REGEX } from '../shared/values'
import { KanjiSubject } from '../learning/lessons/SubjectTypes'
import { toHiragana, isHiragana } from 'wanakana'
import './index.scss'

interface DictionaryResults {
    vocabulary: JmdictAndLevels[]
    kanji: KanjiSubject[]
}

export const Dictionary = () => {
    const { word } = useParams()
    const [dictionaryResults, changeDictionaryResults] = useState<DictionaryResults>({vocabulary: [] ,kanji: []})
    const { fetchData, isFetching, isError } = useFetchStatus<DictionaryResults>('subjects/search/', changeDictionaryResults);
    const [typeOfEntriesToShow, changeTypeOfEntriesToShow] = useState<'vocab' | 'kanji'>('vocab')
    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
    ])

    useEffect(() => {
        if (word != null && word.length > 0) {
            fetchData({type: 'post', data: {word}})
        }
    }, [word, fetchData])

    useEffect(() => {
        const handleWindowResize = () => {
          setWindowSize([window.innerWidth, window.innerHeight]);
        };
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);    

    const wordIsJapanese = word != null && JAPANESE_CHAR_REGEX.test(word)
    const quotesAroundWord = word != null && word.length > 1 && word[0] === '"' && word[word.length - 1] === '"'

    const vocabuaryResults = useMemo(() => (
        <div className='vocabulary-results-container'>
            {dictionaryResults.vocabulary.map((dictionaryInfo, i) => (
                <VocabularyDictionaryEntry key={i} {...dictionaryInfo} />
            ))}
        </div>
    ), [dictionaryResults.vocabulary])

    const kanjiResults = useMemo(() => (
        <div className='kanji-results-container'>
            {dictionaryResults.kanji.map((kanjiInfo, i) => (
                <KanjiDictionaryEntry key={i} {...kanjiInfo} />
            ))}
        </div>
    ), [dictionaryResults.kanji])

    return (
        <div className='dictionary-page-container'>
            <h1>Dictionary</h1>
            <div className='dictionary-vocab-kanji-selector-container'>
                <button
                    className={`dictionary-vocab-selector-${typeOfEntriesToShow === 'vocab' ? 'selected' : 'not-selected'}`} 
                    onClick={() => changeTypeOfEntriesToShow('vocab')}
                >
                    Vocabulary
                </button>
                <button
                    className={`dictionary-kanji-selector-${typeOfEntriesToShow === 'kanji' ? 'selected' : 'not-selected'}`} 
                    onClick={() => changeTypeOfEntriesToShow('kanji')}
                >
                    Kanji
                </button>
            </div>

            {word != null && (
                <p className='dictionary-header'>
                    Search results for:&nbsp;
                    <span className='word-user-is-searching-for'>
                        {wordIsJapanese ? word : (quotesAroundWord  || !isHiragana(toHiragana(word)) ? word : toHiragana(word))}.
                    </span>
                    {!wordIsJapanese && !(quotesAroundWord  || !isHiragana(toHiragana(word))) && <span>&nbsp;Type "{word}" to search for it in English</span>}
                </p>
            )}

            {
                (() => {
                    if (isFetching) {
                        return <WaitingForDataToProcess waitMessage='Getting your search results...'/>
                    } else if (isError) {
                        return <p>Sorry, there seems to be an issue with our dictonary right now, please try again later</p>
                    } else if (windowSize[0] >= 992) {
                        return (
                            <div className='dictionary-results-container-large-screen'>
                                {vocabuaryResults}
                                {kanjiResults}
                            </div>
                        )
                    } else {
                        return typeOfEntriesToShow === 'vocab' ? vocabuaryResults : kanjiResults
                    }
                })()
            }
        </div>
    )
}