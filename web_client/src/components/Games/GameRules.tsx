import { useState } from 'react'
import './GameRules.scss'

interface GameRulesProps {
  objective: string
  rules: string[]
}

export const GameRules = ({
  objective,
  rules
}: GameRulesProps): JSX.Element => {
  const [showRules, changeShowRules] = useState(false)

  return (
        <div className='game-rules-container'>
            <div
                onClick={() => changeShowRules(!showRules)}
                className='show-rules-button'
            >
                {showRules ? 'Hide' : 'View'} Rules
            </div>
            <div style={{ display: showRules ? 'block' : 'none' }}>
                <div className='game-rules-header'>Objective:</div>
                <ul className='game-rules-list'>
                    <li>{objective}</li>
                </ul>
                <div className='game-rules-header'>Rules:</div>
                <ul className='game-rules-list'>
                    {rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                    ))}
                </ul>
            </div>
        </div>
  )
}
