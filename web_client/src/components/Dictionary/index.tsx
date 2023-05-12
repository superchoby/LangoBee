import { useFetchStatus } from '../shared/useFetchStatus'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DictionaryEntry, JmdictAndLevels } from './DictionaryEntry'
import { WaitingForDataToProcess } from '../shared/WaitingForDataToProcess'
import { JAPANESE_CHAR_REGEX } from '../shared/values'
import { toHiragana, isHiragana } from 'wanakana'
import './index.scss'


export const Dictionary = () => {
    const { word } = useParams()
    const [dictionaryResults, changeDictionaryResults] = useState<JmdictAndLevels[]>([])
    const { fetchData, isFetching, isError } = useFetchStatus<JmdictAndLevels[]>('jmdict/search/', changeDictionaryResults);

    useEffect(() => {
        if (word != null && word.length > 0) {
            fetchData({type: 'post', data: {word}})
        }
    }, [word, fetchData])

    const wordIsJapanese = word != null && JAPANESE_CHAR_REGEX.test(word)
    const quotesAroundWord = word != null && word.length > 1 && word[0] === '"' && word[word.length - 1] === '"'

    return (
        <div>
            <h1>Dictionary</h1>
            {word != null && (
                <p className='dictionary-header'>
                    Search results for:&nbsp;
                    <span className='word-user-is-searching-for'>
                        {wordIsJapanese ? word : (quotesAroundWord  || !isHiragana(toHiragana(word)) ? word : toHiragana(word))}.
                    </span>
                    {!wordIsJapanese && !(quotesAroundWord  || !isHiragana(toHiragana(word))) && <span>&nbsp;Type "{word}" to search for it in English</span>}
                </p>
            )}
            {isError ? (
                <p>Sorry, there seems to be an issue with our dictonary right now, please try again later</p>
            ) : (
                isFetching ? (
                    <WaitingForDataToProcess waitMessage='Getting your search results...'/>
                ) : (
                    <div className='dictionary-results-container'>
                        {dictionaryResults.map((dictionaryInfo, i) => (
                            <DictionaryEntry key={i} {...dictionaryInfo} />
                        ))}
                    </div>
                )
            )}
        </div>
    )
}