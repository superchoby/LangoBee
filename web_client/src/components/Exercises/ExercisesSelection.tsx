import { ExerciseOption } from './ExerciseOption'
import { FaPencilAlt } from 'react-icons/fa'
import { BsSpeedometer } from 'react-icons/bs'
import { LIST_OF_EXERCISES_PATHS } from 'src/paths'
import './index.scss'

const exercises = [
    // {
    //     name: 'Writing Sheets',
    //     icon: <FaPencilAlt />,
    //     description: 'Japanese writing printouts',
    //     path: LIST_OF_EXERCISES_PATHS.WRITING_SHEETS
    // },
    {
        name: 'Number Drills',
        icon: <BsSpeedometer />,
        description: 'Practice converting numbers to Japanese',
        path: LIST_OF_EXERCISES_PATHS.NUMBER_DRILLS
    },
    {
        name: 'Writing Canvas',
        icon: <span className='bold-span'>COMING SOON</span>,
        description: 'Practice writing any character',
        path: LIST_OF_EXERCISES_PATHS.WRITING_CANVAS,
        comingSoon: true
    }
]

export const Exercises = () => {
    
    return (
        <div className='exercises-container'>
            <h1>Exercises</h1>
            <div className='exercise-options-container'>
                {exercises.map(props => (
                    <ExerciseOption {...props} />
                ))}
            </div>
        </div>
    )
}