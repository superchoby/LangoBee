import { BsCheckLg } from 'react-icons/bs'
import './WritingSheetsCharacterChoices.scss'
import { useState } from 'react'
import { 
  AiFillCaretDown,
  AiFillCaretUp
} from 'react-icons/ai'

interface WritingSheetsCharacterChoicesProps {
  header: string
  characters: readonly string[]
  selectedCharacters: string[]
  onCharacterClick: (characterClicked: string, characterWasSelected: boolean) => void
  // handleCharacterSelect(character: string, hasBeenSelected: boolean): void
}

export const WritingSheetsCharacterChoices = ({
  header,
  characters,
  selectedCharacters,
  onCharacterClick
  // handleCharacterSelect
}: WritingSheetsCharacterChoicesProps) => {
  const [showCharacters, changeShowCharacters] = useState(false)

  return (
        <div>
            <div className='writing-sheet-character-choice-header'>
              <h2>{header}</h2>
              {showCharacters ? 
                <AiFillCaretUp onClick={() => changeShowCharacters(false)} size={30} /> : 
                <AiFillCaretDown onClick={() => changeShowCharacters(true)} size={30} />
              }
            </div>
            
            <div className='writing-sheets-character-choices-container'>
                {showCharacters && characters.map(charactersCol => (
                    <div className='writing-sheets-character-choices-col' key={charactersCol}>
                        {charactersCol.split('').map(character => {
                          const isSelected = selectedCharacters.includes(character)
                          return (
                                <button
                                    className='writing-sheets-character-choice'
                                    key={character}
                                    onClick={() => {
                                      onCharacterClick(character, isSelected)
                                    }}
                                >
                                    {/* <input className='writing-sheets-character-choice-checkbox' type='checkbox' />
                                    <label>{character}</label> */}
                                    <span className={`writing-sheets-character-choice-checkbox ${isSelected ? 'writing-sheets-character-choice-checkbox-selected' : ''}`}>
                                        <BsCheckLg className='writing-sheets-character-choice-checkmark' color='white' />
                                    </span>
                                    <span className='writing-sheets-character-choice-character'>{character}</span>
                                </button>
                          )
                        })}
                    </div>
                ))}
            </div>

        </div>
  )
}
