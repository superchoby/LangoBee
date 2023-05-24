import { BsCheckLg } from 'react-icons/bs'
import './WritingSheetsCharacterChoices.scss'
import { useEffect, useState } from 'react'
import { 
  AiFillCaretDown,
  AiFillCaretUp
} from 'react-icons/ai'
import { PRINT_TYPE, CAN_PRINT_NOW } from '.';

interface WritingSheetsCharacterChoicesProps {
  header: string
  characters: readonly string[]
  selectedCharacters: string[]
  customContent?: JSX.Element
  onCharacterClick: (characterClicked: string, characterWasSelected: boolean) => void
  printStatus: PRINT_TYPE
}

export const WritingSheetsCharacterChoices = ({
  header,
  characters,
  customContent,
  selectedCharacters,
  onCharacterClick,
  printStatus
  // handleCharacterSelect
}: WritingSheetsCharacterChoicesProps) => {
  const [showCharacters, changeShowCharacters] = useState(false)

  useEffect(() => {
    if (printStatus === CAN_PRINT_NOW) {
      changeShowCharacters(false)
    }
  }, [printStatus])

  return (
        <div>
            <div className='writing-sheet-character-choice-header' onClick={() => changeShowCharacters(!showCharacters)}>
              <h2>{header}</h2>
              {showCharacters ? 
                <AiFillCaretUp size={30} /> : 
                <AiFillCaretDown size={30} />
              }
            </div>
            
            <div className='writing-sheets-character-choices-container'>
                {showCharacters && (customContent == null ? characters.map(charactersCol => (
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
                                    <span className={`writing-sheets-character-choice-checkbox ${isSelected ? 'writing-sheets-character-choice-checkbox-selected' : ''}`}>
                                        <BsCheckLg className='writing-sheets-character-choice-checkmark' color='white' />
                                    </span>
                                    <span className='writing-sheets-character-choice-character'>{character}</span>
                                </button>
                          )
                        })}
                    </div>
                )) : customContent)}
            </div>

        </div>
  )
}
