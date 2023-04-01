import { Link } from 'react-router-dom'
import { EXERCISES_PATH } from 'src/paths'
import './ExerciseOption.scss'

interface ExerciseOptionProps {
    name: string
    icon: JSX.Element
    description: string
    path: string
    comingSoon?: boolean
}
export const ExerciseOption = ({
    name,
    icon,
    description,
    path,
    comingSoon
}: ExerciseOptionProps) => {
    return (
        <Link to={`${EXERCISES_PATH}${comingSoon ? '' : path}`}className={`exercise-option ${comingSoon ? 'exercise-option-that-coming-soon' : ''}`}>
            {/* {comingSoon && <span className='bold-span'>COMING SOON</span>} */}
            <h3>{name}</h3>
            {icon}
            <p className='exercise-option-description'>{description}</p>
        </Link>
    )
}