import { useState } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import './WritingSheetsCharacterChoices.scss'

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
  const [showChoices, changeShowChoices] = useState(false)

  return (
        <div className='writing-character-choices-container'>
            <div className='writing-character-choices-header' onClick={() => { changeShowChoices(!showChoices) }}>
                <h2>{header}</h2>{showChoices ? <AiFillCaretUp /> : <AiFillCaretDown />}
            </div>
            {showChoices && (
                <div className='writing-sheets-character-choices-buttons'>
                    {characters.map(charactersCol => (
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
            )}
        </div>
  )
}
