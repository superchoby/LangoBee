import { JapaneseSubjectData } from '../../../learning/lessons/SubjectTypes'
import { getPropsForSubjectsInfo } from '../../../learning/SubjectsSubInfo'
import { Link } from 'react-router-dom'
import { Header } from 'src/components/HeaderAndNavbar/Header'
import { Fragment } from 'react'
import { WaitingForDataToProcess } from '../../WaitingForDataToProcess'
import './index.scss'

interface QuizResultsSubjectsResultsProps {
  header: string
  subjects: JapaneseSubjectData[]
  componentForEachSubject?: (subjectText: string, subjectId: string) => JSX.Element
}

const QuizResultsSubjectsResults = ({
  header,
  subjects,
  componentForEachSubject
}: QuizResultsSubjectsResultsProps) => {
  return (
        <div>
            <h2>{header}</h2>
            {subjects.map((card) => {
              const {
                subjectText
              } = getPropsForSubjectsInfo(card, false)

              return componentForEachSubject != null
                ? (
                        <Fragment key={subjectText}>
                            {componentForEachSubject(subjectText, card.subjectId)}
                        </Fragment>
                  ) : (
                        <div className='specific-subjects-quiz-results' key={subjectText}>
                            {/* <div className='specific-subjects-quiz-results-new-review-level'>{reviewLevel}</div> */}
                            <div className='specific-subjects-quiz-results-specific-subjects-text'>{subjectText}</div>
                        </div>
                  )
            })}
        </div>
  )
}

interface QuizResultsPageProps {
  correctSubjects: JapaneseSubjectData[]
  incorrectSubjects: JapaneseSubjectData[]
  hasIncorrectSection: boolean
  correctSectionHeader?: string
  componentForEachSubject?: (subjectText: string, subjectId: string) => JSX.Element
  leaveButtonLink: string
  leaveButtonText: string
  messageOnTop: string
  showLoadingResultsMessage: boolean
}

export const QuizResultsPage = ({
  correctSubjects,
  incorrectSubjects,
  hasIncorrectSection,
  correctSectionHeader = 'Correct',
  componentForEachSubject,
  leaveButtonLink,
  leaveButtonText,
  messageOnTop,
  showLoadingResultsMessage
}: QuizResultsPageProps) => {

  return (
      <div className='quiz-results-page'>
          <Header />
          <div className='quiz-results-page-header-and-home-button'>
              <h1>Summary</h1>
              <Link
                  className='quiz-results-page-home-button'
                  data-testid='quiz-results-page-leave-button'
                  to={leaveButtonLink}
              >
                  {leaveButtonText}
              </Link>
          </div>

          {showLoadingResultsMessage ? (
            <WaitingForDataToProcess />
          ) : (
            <>
              <p className='quiz-results-page-message-on-top'>{messageOnTop}</p>
              <QuizResultsSubjectsResults header={correctSectionHeader} subjects={correctSubjects} componentForEachSubject={componentForEachSubject} />
              {hasIncorrectSection && <QuizResultsSubjectsResults header='Incorrect' subjects={incorrectSubjects} componentForEachSubject={componentForEachSubject} />}
            </>
          )}

      </div>
  )
}
