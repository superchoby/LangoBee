import {
  NumberDrills,
  // WritingSheets,
  WritingCanvas
} from './ExercisesList'
import { LIST_OF_EXERCISES_PATHS, EXERCISES_PATH } from 'src/paths'
import { useParams } from 'react-router-dom'
import { Header } from '../HeaderAndNavbar/Header'
import { useState } from 'react'
import { BackButton } from '../shared/BackButton'
import './ActualExercise.scss'

export const ActualExercise = () => {
  const [exerciseHasStarted, changeExerciseHasStarted] = useState(false)
  const { exerciseName } = useParams()

  const {
    // WRITING_SHEETS,
    NUMBER_DRILLS,
    WRITING_CANVAS
  } = LIST_OF_EXERCISES_PATHS

  const PATHS_TO_EXERCISES = {
    // [WRITING_SHEETS]: <WritingSheets changeExerciseHasStarted={changeExerciseHasStarted} exerciseHasStarted={exerciseHasStarted} />,
    // [WRITING_SHEETS]: <WritingSheets />,
    [NUMBER_DRILLS]: <NumberDrills changeExerciseHasStarted={changeExerciseHasStarted} exerciseHasStarted={exerciseHasStarted} />,
    [WRITING_CANVAS]: <WritingCanvas />
  } as const

  return (
        <div className='actual-exercise-container'>
            {!exerciseHasStarted && <Header />}
            <div className={exerciseHasStarted ? '' : 'actual-exercise-contents-no-header'}>
                {!exerciseHasStarted && <BackButton text='Back' link={EXERCISES_PATH} />}
                {PATHS_TO_EXERCISES['/' + exerciseName!]}
            </div>
        </div>
  )
}
