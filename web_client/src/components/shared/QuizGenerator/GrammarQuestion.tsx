import { useCallback, useState, useEffect, useMemo } from 'react'
import './GrammarQuestion.scss'
import { GrammarFillInInput } from './GrammarFillInInput'
// import {
//   GrammarQuestionType
// } from '../../../context/JapaneseDatabaseContext/SharedVariables'
import { QuizQuestion } from './ConvertSubjectDataToQuestions'
import { GrammarQuestionType } from 'src/context/JapaneseDatabaseContext/SharedVariables'
import { GrammarSubject, GrammarFormalityAndDescriptions } from 'src/components/learning/lessons/SubjectTypes'

const parseHtmlString = (htmlString: string, className?: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(`<p>${htmlString}</p>`,"text/xml");
  const bolds = xmlDoc.getElementsByTagName('bold')
  while (bolds.length > 0) {
    const span = document.createElement('span')
    span.classList.add('bold-span')
    span.textContent = bolds[0].textContent
    bolds[0].replaceWith(span)
  }

  return <div dangerouslySetInnerHTML={{__html: xmlDoc.documentElement.innerHTML}} className={className} />
}

const ANSWER_OPENING_BRACKET = '<answer>'
const ANSWER_CLOSING_BRACKET = '</answer>'

interface GrammarQuestionProps {
  choiceSubmitted: boolean
  question: QuizQuestion
  currentAnswerStatus: 'correct' | 'incorrect' | 'acceptable but not correct'
  changeCurrentAnswerStatus: (status: 'correct' | 'incorrect' | 'acceptable but not correct') => void
  changeIsInvalidInput: (isInvalid: boolean) => void
  hasInvalidInputClass: boolean
}

type GrammarFillInputInfo = boolean[]

/**
 * Handles all grammar questions
 */
export const GrammarQuestion = ({
  choiceSubmitted,
  question,
  currentAnswerStatus,
  changeCurrentAnswerStatus,
  changeIsInvalidInput,
  hasInvalidInputClass
}: GrammarQuestionProps): JSX.Element => {
  const {
    question: questionText,
    englishTranslation,
    explanationIfUserGetsIncorrect
  } = question.questionContents as GrammarQuestionType

  const {
    formalityMattersForItsQuestions,
    formality
  } = question.subjectData as GrammarSubject
  
  const [grammarFillInputTextIsCorrect, changeGrammarFillInputTextIsCorrect] = useState<GrammarFillInputInfo>([])
  const [grammarFillInputTextIsInvalid, changeGrammarFillInputTextIsInvalid] = useState<GrammarFillInputInfo>([])

  const handleUpdateCorrectAnswer = useCallback((idx: number, isCorrect: boolean): void => {
    const copy = [...grammarFillInputTextIsCorrect]
    copy[idx] = isCorrect
    changeGrammarFillInputTextIsCorrect(copy)
  }, [grammarFillInputTextIsCorrect])

  const handleUpdateInvalidAnswer = useCallback((idx: number, isInvalid: boolean): void => {
    const copy = [...grammarFillInputTextIsInvalid]
    copy[idx] = isInvalid
    changeGrammarFillInputTextIsInvalid(copy)
  }, [grammarFillInputTextIsInvalid])

  const grammarQuestionComponents = useMemo(() => {
    let inputIdx = 0
    const components = questionText.split(ANSWER_OPENING_BRACKET).flatMap((text) => {
      if (text.includes(ANSWER_CLOSING_BRACKET)) {
        const [answer, textRemainingAfter] = text.split(ANSWER_CLOSING_BRACKET)
        const isTheFirstInput = inputIdx === 0

        const inputComponent = <GrammarFillInInput
                                  grammarFillInputTextIsCorrect={grammarFillInputTextIsCorrect}
                                  grammarFillInputTextIsInvalid={grammarFillInputTextIsInvalid}
                                  answer={answer}
                                  updateAnswerCorrectStatus={handleUpdateCorrectAnswer}
                                  updateInputIsInvalidStatus={handleUpdateInvalidAnswer}
                                  autoFocus={isTheFirstInput}
                                  choiceSubmitted={choiceSubmitted}
                                  hasInvalidInputClass={hasInvalidInputClass}
                                  questionText={questionText}
                                  // onANewQuestion={onANewQuestion}
                                  idx={inputIdx}
                                  key={inputIdx}
                                  isFirstInput={isTheFirstInput}
                              />
        inputIdx += 1

        return [inputComponent, textRemainingAfter]
      } else {
        return text
      }
    })

    return components
  }, [
    choiceSubmitted,
    handleUpdateCorrectAnswer,
    handleUpdateInvalidAnswer,
    grammarFillInputTextIsCorrect,
    grammarFillInputTextIsInvalid,
    hasInvalidInputClass,
    questionText
  ])

  useEffect(() => {
    const numOfAnswers = questionText.split(ANSWER_OPENING_BRACKET).length - 1

    changeGrammarFillInputTextIsCorrect(Array(numOfAnswers).fill(false))
    changeGrammarFillInputTextIsInvalid(Array(numOfAnswers).fill(true))
  }, [questionText])

  useEffect(() => {
    changeCurrentAnswerStatus(!grammarFillInputTextIsCorrect.includes(false) ? 'correct' : 'incorrect')
  }, [grammarFillInputTextIsCorrect, changeCurrentAnswerStatus])

  useEffect(() => {
    changeIsInvalidInput(grammarFillInputTextIsInvalid.includes(true))
  }, [grammarFillInputTextIsInvalid, changeIsInvalidInput])

  return (
      <div className='grammar-question-container' data-testid='grammar-question-container'>
          <div>
              {grammarQuestionComponents}
          </div>
          <div>
              {parseHtmlString(englishTranslation)} {formalityMattersForItsQuestions && `(${GrammarFormalityAndDescriptions[formality].nameForPresentation})`}
              
                {/* {formalityMattersForItsQuestions && (
                  
                    <p className='grammar-formality-container'>
                      formality: <span className='grammar-formality'>{GrammarFormalityAndDescriptions[formality].nameForPresentation}</span>
                    </p>
                )} */}
          </div>
          <div
              className='explanation-for-incorrect-guess-on-grammar-question'
              style={{ display: choiceSubmitted ? (currentAnswerStatus === 'correct' ? 'none' : 'block') : 'none' }}
          >
              {explanationIfUserGetsIncorrect}
          </div>
      </div>
  )
}
