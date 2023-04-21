import { 
    JapaneseSubjectData,
    KANA_TYPE,
    RADICAL_TYPE,
    VOCABULARY_TYPE,
    GRAMMAR_TYPE,
    KanaSubject,
    RadicalSubject,
    JapaneseVocabularySubject,
    JMDictSense,
    JapaneseExerciseSubject,
    EXERCISE_TYPE,
    KANJI_TYPE,
    KanjiSubject,
    GrammarSubject
} from '../../learning/lessons/SubjectTypes'
import shuffle from 'shuffle-array'
import {
    ROMAJI_QUESTION_PROMPT,
    TRANSLATE_JAPANESE_VOCAB_PROMPT,
    KANJI_MEANING_QUESTION_PROMPT,
    RADICAL_QUESTION_PROMPT
} from 'src/context/JapaneseDatabaseContext/SharedVariables'
import { toRomaji, toHiragana } from 'wanakana'
import {
  KanaVocabQuestionType,
  GrammarQuestionType,
  ConjugationQuestionType,
} from 'src/context/JapaneseDatabaseContext/SharedVariables'
import { SubjectsAnsweredStatus } from '.'

const KANJI_TO_NUMBER = {
  '一': { hiragana: 'いち', number: 1 },
  '二': { hiragana: 'に', number: 2 },
  '三': { hiragana: 'さん', number: 3 },
  '四': { hiragana: 'よん,し', number: 4 },
  '五': { hiragana: 'ご', number: 5 },
  '六': { hiragana: 'ろく', number: 6 },
  '七': { hiragana: 'なな,しち', number: 7 },
  '八': { hiragana: 'はち', number: 8 },
  '九': { hiragana: 'きゅう', number: 9 },
  '十': { hiragana: 'じゅう', number: 10 },
}

export interface QuizQuestion {
  questionContents: KanaVocabQuestionType | GrammarQuestionType | ConjugationQuestionType
  subjectData: JapaneseSubjectData
}

export const convertSubjectDataToQuestions = (subjectData: JapaneseSubjectData[]): {
    timesSubjectAnsweredAndNeedsToBeAnswered: SubjectsAnsweredStatus
    newQuestionsOrder: QuizQuestion[]
} => {
    const timesSubjectAnsweredAndNeedsToBeAnswered: SubjectsAnsweredStatus = {}
    const newQuestionsOrder: QuizQuestion[] = []

    for (const concept of subjectData) {
      if (concept.japaneseSubjectType === KANA_TYPE) {
        const kanaSubject = concept as KanaSubject
        let kanaQuestionAnswers: any[] = []
        if (kanaSubject.reading.includes(',')) {
          kanaQuestionAnswers = kanaSubject.reading.split(',').map((reading) => ({
            answer: reading, distanceToAllow: 0
          }))
        } else {
          kanaQuestionAnswers = [{answer: toRomaji(kanaSubject.character), distanceToAllow: 0}]
        }
        if (kanaSubject.customQuestions.length > 0) {
          shuffle(kanaSubject.customQuestions, { copy: true }).slice(0, 2).forEach((question) => {
            newQuestionsOrder.push({
              questionContents: {
                answers: question.answers.map(answer => ({ answer, distanceToAllow: 0 })),
                acceptableResponsesButNotWhatLookingFor: [],
                answerIsInJapanese: false,
                question: question.question,
                questionIsOfTypeString: true,
                questionPrompt: ROMAJI_QUESTION_PROMPT,
                inputPlaceholder: 'Romaji',
                pronunciationFile: ''
              },
              subjectData: concept
            })
          })
          timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
            timesAnswered: 0,
            timesNeedsToBeAnsweredBeforeCompletion: 2,
            userGotCorrect: true
          }
        } else {
          newQuestionsOrder.push({
            questionContents: {
              answers: kanaQuestionAnswers,
              acceptableResponsesButNotWhatLookingFor: [],
              answerIsInJapanese: false,
              question: kanaSubject.character,
              questionIsOfTypeString: true,
              questionPrompt: ROMAJI_QUESTION_PROMPT,
              inputPlaceholder: 'Romaji',
              pronunciationFile: toHiragana(kanaSubject.character) + '.mp3'
            },
            subjectData: concept
          })

          timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
            timesAnswered: 0,
            timesNeedsToBeAnsweredBeforeCompletion: 1,
            userGotCorrect: true
          }
        }
        
        
      } else if (concept.japaneseSubjectType === VOCABULARY_TYPE) {
        const vocabularySubject = concept as JapaneseVocabularySubject
        const getAllVocabsMeanings = (jmdictSense: JMDictSense[]) => {
          return jmdictSense.reduce((senseAccumulator, {gloss}) => {
            return [
              ...senseAccumulator,
              ...gloss.reduce((glossAccumulator, {text}) => {
                return [
                  ...glossAccumulator,
                  ...(text != null ? [text] : [])
                ]
              }, [] as string[])
            ]
          }, [] as string[])
        }

        const {
          jmdict,
          mainMeaningsToUse,
          counterWordInfo,
          mainTextRepresentation,
          acceptableResponsesButNotWhatLookingFor
        } = vocabularySubject

        const mainTextRepresentationExists = mainTextRepresentation != null && mainTextRepresentation.length > 0

        if (jmdict != null) {
          const {
            sense,
            kanjiVocabulary,
            kanaVocabulary,
            jmDictId
          } = jmdict

          if (vocabularySubject.customQuestions.length > 0) {
            shuffle(vocabularySubject.customQuestions, { copy: true }).slice(0, 2).forEach((question) => {
              newQuestionsOrder.push({
                questionContents: {
                  answers: question.answers.map(answer => ({ answer, distanceToAllow: Math.floor(answer.length * .25) })),
                  acceptableResponsesButNotWhatLookingFor: [],
                  answerIsInJapanese: false,
                  question: question.question,
                  questionIsOfTypeString: true,
                  questionPrompt: TRANSLATE_JAPANESE_VOCAB_PROMPT,
                  inputPlaceholder: 'Meaning',
                  pronunciationFile: ''
                },
                subjectData: concept
              })})
  
              timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
                timesAnswered: 0,
                timesNeedsToBeAnsweredBeforeCompletion: 2,
                userGotCorrect: true
              }
          } else {
            const allMeanings: string[] = [...mainMeaningsToUse, ...getAllVocabsMeanings(sense)]
  
            const vocabIsUsuallyWrittenInKana = sense[0].misc.includes('uk') || kanjiVocabulary.length === 0
            const mainVocabularyToUse = mainTextRepresentationExists ? mainTextRepresentation : (vocabIsUsuallyWrittenInKana ? kanaVocabulary[0].text : kanjiVocabulary[0].text)

            newQuestionsOrder.push({
              questionContents: {
                answers: allMeanings.flatMap((meaning) => {
                  const answers = [
                    {
                      answer: meaning,
                      distanceToAllow: Math.floor(meaning.length * .25)
                    }
                  ]
                  const openingParenIdx = meaning.indexOf('(')
                  const closingParenIdx = meaning.indexOf(')')
                  if (openingParenIdx !== -1 && closingParenIdx !== -1) {
                    const answerWithoutParenthesis = (meaning.substring(0, openingParenIdx) + meaning.substring(closingParenIdx + 1)).trim()
                    answers.push(
                      {
                        answer: answerWithoutParenthesis,
                        distanceToAllow: Math.floor(answerWithoutParenthesis.length * .25)
                      }
                    )
                  }

                  const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
                  if (specialChars.test(meaning)) {
                    const answerWithNoSpecialChars = meaning.split('').filter(char => !specialChars.test(char)).join('')
                    answers.push({
                      answer: answerWithNoSpecialChars,
                      distanceToAllow: Math.floor(answerWithNoSpecialChars.length * .25)
                    })
                  }
                  return answers
                }),
                acceptableResponsesButNotWhatLookingFor: acceptableResponsesButNotWhatLookingFor.map(({response, reason}) => ({
                  acceptableResponse: response,
                  whyNotLookingFor: reason,
                  acceptableResponseIsJapanese: false
                })),
                answerIsInJapanese: false,
                question: mainVocabularyToUse,
                questionIsOfTypeString: true,
                questionPrompt: TRANSLATE_JAPANESE_VOCAB_PROMPT,
                inputPlaceholder: 'Meaning',
                pronunciationFile: `${jmDictId}.mp3`
              },
              subjectData: concept
            })
    
            if (vocabIsUsuallyWrittenInKana) {
                timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
                    timesAnswered: 0,
                    timesNeedsToBeAnsweredBeforeCompletion: 1,
                    userGotCorrect: true
                }
            } else {
                newQuestionsOrder.push({
                    questionContents: {
                      answers: kanaVocabulary.map(({text}) => ({
                        answer: text,
                        distanceToAllow: 0
                      })),
                      acceptableResponsesButNotWhatLookingFor: [],
                      answerIsInJapanese: true,
                      question: mainVocabularyToUse,
                      questionIsOfTypeString: true,
                      questionPrompt: TRANSLATE_JAPANESE_VOCAB_PROMPT,
                      inputPlaceholder: 'Reading',
                      pronunciationFile: `${jmDictId}.mp3`
                    },
                    subjectData: concept
                })
                timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
                    timesAnswered: 0,
                    timesNeedsToBeAnsweredBeforeCompletion: 2,
                    userGotCorrect: true
                }
            }
          }
        } else {
          // is counter info
          const {
            character,
            usage,
            howToAskForHowMany,
            objectsThisIsUsedToCount,
            specialNumbers,
            normalReading
          } = counterWordInfo!


          let kanjiAnswer = ''
          let hiraganaAnswer = ''
          let isANumber = false
          let isTheHowMuchVersion = false
          if (mainTextRepresentation.includes(' ')) {
            const [kanjiVersion, hiraganaVersion] = mainTextRepresentation.split(' ')
            kanjiAnswer = kanjiVersion
            hiraganaAnswer = hiraganaVersion
            if (kanjiVersion === howToAskForHowMany.characters) {
              isTheHowMuchVersion = true
            } else {
              isANumber = true
            }
          }

          if (isTheHowMuchVersion) {
            newQuestionsOrder.push({
                questionContents: {
                  answers: [
                    {
                      answer: hiraganaAnswer.slice(1, -1),
                      distanceToAllow: 0
                    },
                    {
                      answer: kanjiAnswer,
                      distanceToAllow: 0
                    },
                  ],
                  acceptableResponsesButNotWhatLookingFor: [],
                  answerIsInJapanese: true,
                  question: `How many ${objectsThisIsUsedToCount[Math.floor(Math.random() * objectsThisIsUsedToCount.length)].plural}?`,
                  questionIsOfTypeString: true,
                  questionPrompt: "the appropriate Japanese counter you use if you were asking this question",
                  inputPlaceholder: 'Counter',
                  pronunciationFile: ''
                },
                subjectData: concept
            })
            timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
                timesAnswered: 0,
                timesNeedsToBeAnsweredBeforeCompletion: 1,
                userGotCorrect: true
            }
          } else if (isANumber) {
            // KANJI_TO_NUMBER
            const { number } = KANJI_TO_NUMBER[(kanjiAnswer.length > 1 ? kanjiAnswer.slice(0, -1) : kanjiAnswer) as keyof typeof KANJI_TO_NUMBER]

            newQuestionsOrder.push({
              questionContents: {
                answers: [
                  {
                    answer: hiraganaAnswer.slice(1, -1),
                    distanceToAllow: 0
                  },
                  {
                    answer: kanjiAnswer,
                    distanceToAllow: 0
                  },
                ],
                acceptableResponsesButNotWhatLookingFor: [],
                answerIsInJapanese: true,
                question: `${number} ${objectsThisIsUsedToCount[Math.floor(Math.random() * objectsThisIsUsedToCount.length)][number === 1 ? 'singular' : 'plural']}`,
                questionIsOfTypeString: true,
                questionPrompt: "the appropriate Japanese counter",
                inputPlaceholder: 'Counter',
                pronunciationFile: ''
              },
              subjectData: concept
            })
            timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
                timesAnswered: 0,
                timesNeedsToBeAnsweredBeforeCompletion: 1,
                userGotCorrect: true
            }
          } else {
            const specialNumbersKanji = specialNumbers.map(({number}) => number)
            const normalPronunciationNumbers = Object.keys(KANJI_TO_NUMBER).filter(number => !specialNumbersKanji.includes(number))
            
            for (const number of shuffle(normalPronunciationNumbers, { copy: true }).slice(0, 2)) {
              const {
                number: romanNumeral,
                hiragana
              } = KANJI_TO_NUMBER[number as keyof typeof KANJI_TO_NUMBER]

              newQuestionsOrder.push({
                questionContents: {
                  answers: hiragana.split(',').map((reading) => ({
                    answer: `${reading}${normalReading}`,
                    distanceToAllow: 0
                  })),
                  acceptableResponsesButNotWhatLookingFor: [],
                  answerIsInJapanese: true,
                  question: `${romanNumeral} ${objectsThisIsUsedToCount[Math.floor(Math.random() * objectsThisIsUsedToCount.length)][romanNumeral === 1 ? 'singular' : 'plural']}`,
                  questionIsOfTypeString: true,
                  questionPrompt: "the appropriate Japanese counter",
                  inputPlaceholder: 'Counter',
                  pronunciationFile: ''
                },
                subjectData: concept
              })
              timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
                  timesAnswered: 0,
                  timesNeedsToBeAnsweredBeforeCompletion: 2,
                  userGotCorrect: true
              }
            }
          }
        }
      } else if (concept.japaneseSubjectType === RADICAL_TYPE) {
        const radicalSubject = concept as RadicalSubject
        // radicalSubject.meaning.includes('katakana') ? `${radicalSubject.meaning}, ${radicalSubject.meaning.split('katakana').join('').trim()}` : radicalSubject.meaning,
        const radicalAnswers = [{answer: radicalSubject.meaning, distanceToAllow: Math.floor(radicalSubject.meaning.length * .25)}]
        if (radicalSubject.meaning.includes('katakana')) {
          radicalAnswers.push({
            answer: radicalSubject.meaning.split('katakana').join('').trim(),
            distanceToAllow: 0,
          })
        }
        newQuestionsOrder.push({
          questionContents: {
            answers: radicalAnswers,
            acceptableResponsesButNotWhatLookingFor: [],
            answerIsInJapanese: false,
            question: radicalSubject.character,
            questionIsOfTypeString: true,
            questionPrompt: RADICAL_QUESTION_PROMPT,
            inputPlaceholder: 'Name',
            pronunciationFile: ''
          },
          subjectData: concept
        })
        timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
            timesAnswered: 0,
            timesNeedsToBeAnsweredBeforeCompletion: 1,
            userGotCorrect: true
        }
      } else if (concept.japaneseSubjectType === EXERCISE_TYPE) {
        const exerciseSubject = concept as JapaneseExerciseSubject
        newQuestionsOrder.push({
          questionContents: {
            answers: exerciseSubject.answers.map(answer => (
              {
                answer,
                distanceToAllow: 0
              }
            )),
            acceptableResponsesButNotWhatLookingFor: [],
            answerIsInJapanese: true,
            question: exerciseSubject.questionToAsk,
            questionIsOfTypeString: true,
            questionPrompt: exerciseSubject.questionPrompt,
            inputPlaceholder: 'Answer',
            pronunciationFile: ''
          },
          subjectData: concept
        })
        timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
            timesAnswered: 0,
            timesNeedsToBeAnsweredBeforeCompletion: 1,
            userGotCorrect: true
        }
      } else if (concept.japaneseSubjectType === KANJI_TYPE) {
        const kanjiSubject = concept as KanjiSubject
        newQuestionsOrder.push({
          questionContents: {
            answers: kanjiSubject.meanings.map((meaning) => (
              {
                answer: meaning,
                distanceToAllow: Math.floor(meaning.length * .25)
              }
            )),
            
            // [{answer: kanjiSubject.meaning, distanceToAllow: Math.floor(radicalSubject.meaning.length * .25)}],
            acceptableResponsesButNotWhatLookingFor: [],
            answerIsInJapanese: false,
            question: kanjiSubject.character,
            questionIsOfTypeString: true,
            questionPrompt: KANJI_MEANING_QUESTION_PROMPT,
            inputPlaceholder: 'Meaning',
            pronunciationFile: ''
          },
          subjectData: concept
        })
        timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
            timesAnswered: 0,
            timesNeedsToBeAnsweredBeforeCompletion: 1,
            userGotCorrect: true
        }
      } else if (concept.subjectType === GRAMMAR_TYPE) {
        const grammarSubject = concept as GrammarSubject
        const firstQuestion = Math.floor(Math.random()*grammarSubject.questions.length)
        let secondQuestion: number | null = null
        if (grammarSubject.questions.length > 1) {
          secondQuestion = Math.floor(Math.random()*grammarSubject.questions.length)
          while (secondQuestion === firstQuestion) {
            secondQuestion = Math.floor(Math.random()*grammarSubject.questions.length)
          }
        }

        newQuestionsOrder.push({
          questionContents: {
            question: grammarSubject.questions[firstQuestion].questionText,
            explanationIfUserGetsIncorrect: '',
            englishTranslation: grammarSubject.questions[firstQuestion].translations[0].translation
          } as GrammarQuestionType,
          subjectData: concept
        })

        if (secondQuestion != null) {
          newQuestionsOrder.push({
            questionContents: {
              question: grammarSubject.questions[secondQuestion].questionText,
              explanationIfUserGetsIncorrect: '',
              englishTranslation: grammarSubject.questions[secondQuestion].translations[0].translation
            } as GrammarQuestionType,
            subjectData: concept
          })
        }
        
        timesSubjectAnsweredAndNeedsToBeAnswered[concept.subjectId] = {
            timesAnswered: 0,
            timesNeedsToBeAnsweredBeforeCompletion: secondQuestion != null ? 2 : 1,
            userGotCorrect: true
        }
      } else {
        // eventually do some error thing to handle unknown type
      }
    }

    return {
        timesSubjectAnsweredAndNeedsToBeAnswered,
        newQuestionsOrder
    }
}

    