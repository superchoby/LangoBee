export const ROMAJI_QUESTION_PROMPT = " this kana's Romaji"
export const RADICAL_QUESTION_PROMPT = ' the meaning of the radical'
export const TRANSLATE_JAPANESE_VOCAB_PROMPT = ' the corresponding English word'
export const KANJI_MEANING_QUESTION_PROMPT = ' the meaning of the kanji'
export const TRANSLATE_ENGLISH_VOCAB_PROMPT = ' the corresponding Japanese word'
export const CONVERT_KATAKANA_TO_HIRAGANA_PROMPT = ' the corresponding Hiragana'
export const CONVERT_KATAKANA_TO_ROMAJI_PROMPT = ' the corresponding Romaji'
export const GRAMMAR_QUESTION_PROMPT = 'Properly fill in the blanks to connect the sentence'
export const LEARNING_TYPE = 'learning'
export const QUIZ_TYPE = 'Quiz'
export const VOCABULARY_CONCEPT = '単語'
export const GRAMMAR_CONCEPT = '文法'
export const HIRAGANA_EXPLANATIONS_HEADER = 'Romaji'
export const MEANING_EXPLANATIONS_HEADER = 'Meaning'
export const CORRESPONDING_HIRAGANA_HEADER = 'Corresponding Hiragana'
export const EXPLANATION_EXPLANATIONS_HEADER = 'Explanation'
export const HIRAGANA_CONCEPT_TYPE = 'Hiragana'
export const KATAKANA_CONCEPT_TYPE = 'Katakana'
export const VOCABULARY_CONCEPT_TYPE = 'Vocabulary'
export const GRAMMAR_CONCEPT_TYPE = 'Grammar'
export const CONJUGATION_CONCEPT_TYPE = 'Conjugation'
// export const CONVERT_VERB_TO_FORMAL_PRESENT_PROMPT = 'Convert the verb to formal present form'
export const CONVERT_WORD_CONJUGATION_PROMPT = 'Convert the word to the proper conjugation'
// export const CONVERT_VERB_TO_CASUAL_NEGATIVE_PROMPT = 'Convert the verb to casual negative form'
export const ICHIDAN_GROUP = '一段'
export const GODAN_GROUP = '五段'
export const IRREGULAR_VERB_GROUP = 'Irregular'
export type ConjugationType = 'ます' | 'ない'
export type verbGroups = typeof GODAN_GROUP | typeof ICHIDAN_GROUP | typeof IRREGULAR_VERB_GROUP
export type GENERAL_CONCEPT_TYPE =
    typeof HIRAGANA_CONCEPT_TYPE |
    typeof KATAKANA_CONCEPT_TYPE |
    typeof VOCABULARY_CONCEPT_TYPE |
    typeof GRAMMAR_CONCEPT_TYPE |
    typeof CONJUGATION_CONCEPT_TYPE |
    ''

export interface ExtraInfo {
  header: string
  explanation: string | JSX.Element
}

export interface LearningFlashcard {
  concept: string
  explanationHeader: typeof CORRESPONDING_HIRAGANA_HEADER | typeof HIRAGANA_EXPLANATIONS_HEADER | typeof MEANING_EXPLANATIONS_HEADER | typeof EXPLANATION_EXPLANATIONS_HEADER
  explanation: string | JSX.Element
  extraInfoList: ExtraInfo[]
}

interface IQuestion {
  questionPrompt: string
  //   typeof ROMAJI_QUESTION_PROMPT
  // |
  //   typeof CONVERT_KATAKANA_TO_HIRAGANA_PROMPT
  // |
  //   typeof TRANSLATE_JAPANESE_VOCAB_PROMPT
  // |
  //   typeof TRANSLATE_ENGLISH_VOCAB_PROMPT
  // |
  //   typeof GRAMMAR_QUESTION_PROMPT
  // |
  //   typeof CONVERT_KATAKANA_TO_ROMAJI_PROMPT
  // |
  //   typeof CONVERT_WORD_CONJUGATION_PROMPT
  // |
  //   typeof RADICAL_QUESTION_PROMPT
}

interface acceptableResponsesButNotWhatLookingFor {
  acceptableResponse: string
  whyNotLookingFor: string
  acceptableResponseIsJapanese: boolean
}

interface KanaVocabQuestionAnswer {
  answer: string
  distanceToAllow: number
}

interface KanjiAndKanaVersion {
  kanji: string
  kana: string
}

export interface KanaVocabQuestionType extends IQuestion {
  answers: KanaVocabQuestionAnswer[]
  acceptableResponsesButNotWhatLookingFor: acceptableResponsesButNotWhatLookingFor[]
  answerIsInJapanese: boolean
  question: string
  questionIsOfTypeString: boolean
  pronunciationFile: string
  inputPlaceholder: string
}

export interface ConjugationQuestionType extends IQuestion {
  question: string | JSX.Element
  answer: KanjiAndKanaVersion
  explanationIfUserGetsIncorrect: string | JSX.Element
}

export interface GrammarQuestionType extends IQuestion {
  question: string
  explanationIfUserGetsIncorrect: string
  englishTranslation: string
}

interface QuestionSubsection {
  isGrammarQuestion: boolean
  scoreToPass: number
}

export interface FreeResponseSubsection extends QuestionSubsection {
  type: typeof QUIZ_TYPE
  content: KanaVocabQuestionType[]
}

export interface VocabularyOrKanaContent {
  conceptType: typeof HIRAGANA_CONCEPT_TYPE | typeof KATAKANA_CONCEPT_TYPE | 'Vocabulary'
  Learning: LearningFlashcard
  isFastReviewCard: boolean
  Questions: KanaVocabQuestionType[]
}

export interface GrammarContent {
  conceptType: typeof GRAMMAR_CONCEPT_TYPE
  Learning: LearningFlashcard
  isFastReviewCard: boolean
  Questions: GrammarQuestionType[]
}

interface ConjugationContent {
  conceptType: typeof CONJUGATION_CONCEPT_TYPE
  conjugationType: ConjugationType
  Learning: LearningFlashcard
  Questions: ConjugationQuestionType[]
}

export interface LessonsContentDictType {
  [concept: string]: VocabularyOrKanaContent | GrammarContent | ConjugationContent
}

export interface LessonsContentType {
  [lesson: string]: {
    articles: number[]
    content: string[][]
  }
}

export function isAGrammarQuestion (toBeDetermined: KanaVocabQuestionType | GrammarQuestionType | ConjugationQuestionType): toBeDetermined is GrammarQuestionType {
  if ((toBeDetermined as GrammarQuestionType).englishTranslation != null) {
    return true
  }
  return false
}

export function isAKanaVocabQuestion (toBeDetermined: KanaVocabQuestionType | ConjugationQuestionType): toBeDetermined is KanaVocabQuestionType {
  if ((toBeDetermined as KanaVocabQuestionType).answerIsInJapanese != null) {
    return true
  }

  return false
}

interface VerbConjugations {
  masuForm: KanjiAndKanaVersion
  naiForm: KanjiAndKanaVersion
  masenForm: KanjiAndKanaVersion
  taForm: KanjiAndKanaVersion
  teForm: KanjiAndKanaVersion
}

interface JapaneseWord {
  word: string
  kanaVersion: string
  conjugations: VerbConjugations
}

interface JapaneseVerb extends JapaneseWord {
  verbGroup: verbGroups
}

export interface JapaneseDatabaseType {
  [word: string]: JapaneseVerb
}

export type IGetLessonsNumberXsContent = (japaneseDatabase: JapaneseDatabaseType) => LessonsContentDictType
