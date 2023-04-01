import { Link } from 'react-router-dom'
import React from 'react'
import './GameOptionButton.scss'

interface GameOptionButtonProps {
  name: string
  upsell: string
  lessonRequired: string
  usersCurrentLesson: number
  urlName: string
}

export const GameOptionButton = ({
  name,
  upsell,
  lessonRequired,
  usersCurrentLesson,
  urlName
}: GameOptionButtonProps): JSX.Element => {
  const userIsAtAHighEnoughLesson = Number(usersCurrentLesson) >= Number(lessonRequired)
  return (
        <Link to={userIsAtAHighEnoughLesson ? urlName : ''}>
            <div className={`game-option-button-container ${!userIsAtAHighEnoughLesson ? 'game-option-that-is-too-high-level' : ''}`}>
                <div className='game-button-name'>
                    {name}
                </div>
                <div className='game-button-upsell'>
                    {userIsAtAHighEnoughLesson ? upsell : `You must be at lesson ${lessonRequired}`}
                </div>
            </div>
        </Link>
  )
}
