import { useFetchStatus } from '../shared/useFetchStatus'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DictionaryEntry, JmdictAndLevels } from './DictionaryEntry'
import { WaitingForDataToProcess } from '../shared/WaitingForDataToProcess'
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

    return (
        <div>
            <p className='dictionary-header'>Search results for: <span className='word-user-is-searching-for'>{word}</span></p>
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