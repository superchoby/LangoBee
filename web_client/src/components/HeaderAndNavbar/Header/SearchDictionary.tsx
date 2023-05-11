import { useState } from 'react'
import { RxMagnifyingGlass } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom'
import { DICTIONARY_PATH } from 'src/paths'
import './SearchDictionary.scss'

export const SearchDictionary = () => {
    const [word, changeWord] = useState('')
    const navigate = useNavigate()

    const goToDictionary = () => {
        navigate(`${DICTIONARY_PATH}/${word}`)
    }

    return (
        <div className='search-dictionary-container' onKeyDown={({key}) => {if (key === 'Enter') goToDictionary()}}>
            <RxMagnifyingGlass color='gray' size={25} />
            <input 
                className='search-dictionary-input' 
                placeholder='Search for any word or kanji' 
                value={word}
                onChange={({target: {value}}) => changeWord(value)}
            />
            {/* <div className='search-dictionary-border' /> */}
        </div>
    )
}