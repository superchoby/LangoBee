import { useEffect, useState } from 'react'
import { MultipleChoice } from '../../MultipleChoice'
import { type QuizQuestion } from '../ConvertSubjectDataToQuestions'
import { type MultipleChoiceQuestionType } from 'src/context/JapaneseDatabaseContext/SharedVariables'

interface KanaVocabQuestionMultipleChoiceProps {
  currentGuess: string
  changeCurrentGuess: (guess: string) => void
  question: QuizQuestion
  changeCurrentAnswerStatus: (status: 'correct' | 'incorrect' | 'acceptable but not correct') => void
  changeAnswerHasBeenEntered: (entered: boolean) => void
  choiceSubmitted: boolean
  hasNewQuestion: boolean
  handleAnswerSubmitOrHandleFinishedQuiz(): void 
}

export const KanaVocabQuestionMultipleChoice = ({
  currentGuess,
  changeCurrentGuess,
  question,
  changeCurrentAnswerStatus,
  changeAnswerHasBeenEntered,
  choiceSubmitted,
  hasNewQuestion,
  handleAnswerSubmitOrHandleFinishedQuiz
}: KanaVocabQuestionMultipleChoiceProps) => {
  const [correctAnswer, changeCorrectAnswer] = useState('')
  const [wrongAnswers, changeWrongAnswers] = useState<string[]>([])
  const {
    questionContents
  } = question

  useEffect(() => {
    if (hasNewQuestion) {
      const {
        correctAnswer,
        wrongAnswers
      } = questionContents as MultipleChoiceQuestionType
      changeCorrectAnswer(correctAnswer)
      changeWrongAnswers(wrongAnswers)
    }
  }, [hasNewQuestion, questionContents])

  useEffect(() => {
    if (currentGuess.length > 0) {
      changeAnswerHasBeenEntered(true)
      changeCurrentAnswerStatus(currentGuess === correctAnswer ? 'correct' : 'incorrect')
    }
  }, [changeAnswerHasBeenEntered, changeCurrentAnswerStatus, correctAnswer, currentGuess])

  return (
        <div className='kana-vocab-question-multiple-choice-container'>
            <MultipleChoice
                answer={correctAnswer}
                wrongChoices={wrongAnswers}
                valueSelected={currentGuess}
                changeValueSelected={changeCurrentGuess}
                choiceSubmitted={choiceSubmitted}
                handleAnswerSubmitOrHandleFinishedQuiz={handleAnswerSubmitOrHandleFinishedQuiz}
            />
        </div>
  )
}
