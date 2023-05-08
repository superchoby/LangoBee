import './StartExerciseButton.scss'

interface StartExerciseButtonProps {
  startFunction: () => void
}

export const StartExerciseButton = ({
  startFunction
}: StartExerciseButtonProps) => {
  return (
        <button
            className='start-exercise-button'
            onClick={startFunction}
        >
            START
        </button>
  )
}
