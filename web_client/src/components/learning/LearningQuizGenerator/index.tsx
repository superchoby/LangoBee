import { QuizGenerator } from "../../shared/QuizGenerator"
import { JapaneseSubjectData, JapaneseVocabularySubject, KANA_TYPE, KANJI_TYPE, KanaSubject, KanjiSubject, VOCABULARY_TYPE } from "../lessons/SubjectTypes"
import { useAppDispatch } from 'src/app/hooks'
import { userAddedMoreSubjectsToReview } from '../../../app/userSlice'
import { useState, useEffect } from "react"
import { NewSRSCardLevelMsg } from '../../shared/QuizGenerator/NewSRSCardLevelMsg'
import { HOME_PATH, LESSONS_PATH } from "src/paths"
import { QuizResultsPage } from '../../shared/QuizGenerator/QuizResultsPage'
import axios from 'axios'


const LEARNED_ITEMS_WILL_GO_IN_REVIEW_MSG = "Make sure to check your reviews to master these subjects!"
const GOOD_JOB_REVIEWING_MSG = 'Great job reviewing all these concepts!'

type SubjectsAndReviewInfo = { 
    [subjectId: number]: { 
        level: number, 
        isFastReviewCard: boolean 
    } 
}

interface LearningQuizGeneratorProps {
    content: JapaneseSubjectData[]
    errorMessage: string
    isCurrentlyDoingLesson: boolean
    subjectsAndTheirInitialReviewInfo: SubjectsAndReviewInfo
}

const calculateNewSRSLevel = (subjectId: number, userGotSubjectCorrect: boolean, subjectsAndTheirReviewLevel: { [subjectId: number]: { level: number, isFastReviewCard: boolean} }) => {
    const subjectsCurrentLevel = subjectsAndTheirReviewLevel[subjectId].level
    if (userGotSubjectCorrect && subjectsCurrentLevel < 9) {
      return subjectsCurrentLevel + 1
    } else {
      if (subjectsCurrentLevel === 0 || subjectsCurrentLevel === 1) {
        return 1
      } else {
        return subjectsCurrentLevel - 1
      }
    }
  }

export const LearningQuizGenerator = ({
    content,
    errorMessage,
    isCurrentlyDoingLesson,
    subjectsAndTheirInitialReviewInfo,
}: LearningQuizGeneratorProps) => {
    const [subjectsAndTheirReviewLevel, changeSubjectsAndTheirReviewLevel] = useState<{ [subjectId: number]: { level: number, isFastReviewCard: boolean} }>(subjectsAndTheirInitialReviewInfo)
    const [errorUpdatingStatusOfSubject, changeErrorUpdatingStatusOfSubject] = useState(false)
    const [showNewReviewLevel, changeShowNewReviewLevel] = useState(false)

    const dispatch = useAppDispatch()

    useEffect(() => {
        changeSubjectsAndTheirReviewLevel(subjectsAndTheirInitialReviewInfo)
    }, [subjectsAndTheirInitialReviewInfo])

    return (
        <QuizGenerator
            content={content}
            errorMessage=''
            separateCorrectAndIncorrectSubjects={!isCurrentlyDoingLesson}
            resultsPageInfo={{
                hasIncorrectSection: !isCurrentlyDoingLesson,
                headerForCorrectSubjects: isCurrentlyDoingLesson ? 'Subjects Added To Your Review' : 'Correct',
                componentForEachSubject: (subjectText, subjectId) => (
                    <div className='specific-subjects-quiz-results' key={subjectText}>
                        <div className='specific-subjects-quiz-results-new-review-level'>{subjectsAndTheirReviewLevel[subjectId].level}</div>
                        <div className='specific-subjects-quiz-results-specific-subjects-text'>{subjectText}</div>
                    </div>
                ),
                leaveButtonLink: isCurrentlyDoingLesson ? LESSONS_PATH : HOME_PATH,
                // TODO: have srs limit check with this stuff
                leaveButtonText: isCurrentlyDoingLesson ? 'Lessons' : 'HOME',
                messageOnTop: isCurrentlyDoingLesson ? LEARNED_ITEMS_WILL_GO_IN_REVIEW_MSG : GOOD_JOB_REVIEWING_MSG
            }}
            onCompletedAllSubjectsQuestions={(subjectId: number, userGotCorrect: boolean) => {
                for (let i=0; i<content.length; ++i) {
                    if (content[i].subjectId === subjectId) {
                        if (content[i].subjectType === KANA_TYPE) {
                            const {
                                audioFile
                            } = content[i] as KanaSubject
                            (new Audio(audioFile)).play()
                        } else if (content[i].subjectType === VOCABULARY_TYPE) {
                            const {
                                audioFiles
                            } = content[i] as JapaneseVocabularySubject
                            if (audioFiles.length > 0) {
                                (new Audio(audioFiles[0].file)).play()
                                .then(_ => {
                                    // if the kanji word vocab has two common pronunciations,
                                    // play the second one in the callback
                                    if (audioFiles.length > 1) {
                                        (new Audio(audioFiles[1].file)).play()
                                    }
                                })
                            }
                        }
                        break
                    }
                }
                if (isCurrentlyDoingLesson) {
                    dispatch(userAddedMoreSubjectsToReview())
                }

                const newSRSLevel = calculateNewSRSLevel(subjectId, userGotCorrect, subjectsAndTheirReviewLevel)
                axios.post('reviews/', { subjectId: subjectId, newSRSLevel, isFastReviewCard:  subjectsAndTheirReviewLevel[subjectId].isFastReviewCard})
                .then(() => {
                    changeSubjectsAndTheirReviewLevel({
                        ...subjectsAndTheirReviewLevel,
                        [subjectId]: {
                            ...subjectsAndTheirReviewLevel[subjectId],
                            level: newSRSLevel,
                        }
                    })
                    changeErrorUpdatingStatusOfSubject(false)
                    changeShowNewReviewLevel(true)
                })
                .catch(() => {
                    changeErrorUpdatingStatusOfSubject(true)
                })
            }}
            onFinishedSubjectsQuestionsComponent={(_: boolean, subjectId: number, choiceSubmitted: boolean) => {
                if (choiceSubmitted) {
                    if (showNewReviewLevel) {
                        return (
                            <NewSRSCardLevelMsg
                                // userGotSubjectCorrect={isCurrentlyDoingLesson || timesSubjectAnsweredAndNeedsToBeAnswered[questionsOrder[0].subjectData.subjectId].userGotCorrect}
                                userGotSubjectCorrect={true}
                                subjectsCurrentLevel={subjectsAndTheirReviewLevel[subjectId].level as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
                            />
                        )
                    }
                } else {
                    changeShowNewReviewLevel(false)
                }
                return <></>
            }}
        />
    )
}