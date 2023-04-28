import { string } from "prop-types"

export const KANA_TYPE = 'kana'  as const
export const RADICAL_TYPE = 'radical'  as const
export const KANJI_TYPE = 'kanji'  as const
export const VOCABULARY_TYPE = 'vocabulary'  as const
export const EXERCISE_TYPE = 'exercise' as const
export const JAPANESE_VOCABULARY_TYPE = 'japanesevocabulary'
export const GRAMMAR_TYPE = 'grammar'  as const
export const ALPHABET_SUBJECT_TYPE = 'alphabet' as const
export const MAIN_COURSE_NAME = 'main'  as const
export const JAPANESE_LANGUAGE = 'Japanese'  as const
export const ENGLISH_LANGUAGE = 'English'  as const
export const FAST_SRS_SYSTEM = 'fast'  as const
export const DEFAULT_SRS_SYSTEM = 'default'  as const
export const SUBJECT_MODEL_NAME = 'subjects.Subject'  as const
export const JAPANESE_SUBJECT_MODAL_NAME = 'subjects.JapaneseSubject' as const

export const isAHiraganaChar = (char: string) => {
    return 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゃゅょっ'.includes(char)
}

export const isAKatakanaChar = (char: string) => {
    return 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポャュョッ'.includes(char)
}

type LanguageType = typeof JAPANESE_LANGUAGE | typeof ENGLISH_LANGUAGE
export type JapaneseSubjectType = typeof KANA_TYPE | typeof RADICAL_TYPE | typeof KANJI_TYPE | typeof VOCABULARY_TYPE | typeof GRAMMAR_TYPE | typeof EXERCISE_TYPE

export type SubjectInfoToDisplay = {
    header: string
    content: JSX.Element[]
}

type SubjectExample = {
    exampleText: string
    audioFile: string
    translations: {
        language: { name: LanguageType }
        translation: string
    }[]
}

type SubjectInSubjectDifferencesInfo = {
    mainMeaningsToUse: string
    mainTextRepresentation: string
    jmdict: {
        sense: {gloss: {text: string}[]}[]
    }
}

type SubjectDifferences = {
    mainMeaningsToUse: string[]
    mainTextRepresentation: string
    differenceFromPerspectiveOfFirstSubject: string | null
    differenceFromPerspectiveOfSecondSubject: string | null
    generalDifference: string | null
}

export interface GeneralSubject {
    language: LanguageType[]
    courseLevel: (string | number)[] | null
    positionInCourseLevel: number | null
    subjectType: typeof ALPHABET_SUBJECT_TYPE | typeof VOCABULARY_TYPE | typeof GRAMMAR_TYPE
    srsType: (typeof FAST_SRS_SYSTEM | typeof DEFAULT_SRS_SYSTEM)[]
    hasUniqueSubjectModel: true
}

interface CustomSubjectQuestion {
    question: string
    answers: string[]
}

export interface JapaneseSubject {
    jlptLevel: number | null
    japaneseSubjectType: JapaneseSubjectType
}

export interface ImageMnemonic {
   url: string
   contentType: 'image/png' | 'image/svg+xml'
}
 
interface KanaAndRadicalBase {
   character: string
   mnemonicExplanation: string
   mnemonicImage: string
   mnemonicImageContentType: 'image/png' | 'image/svg+xml' | ''
}

export interface KanaSubject extends KanaAndRadicalBase {
    audioFile: string
    reading: string
    kanaType: 'hiragana' | 'katakana'
    isSpecialKana?: boolean
    specialKanaExplanation?: string
    pronunciationNote?: string
    customQuestions: CustomSubjectQuestion[]
}

export interface RadicalSubject extends KanaAndRadicalBase {
    meaning: string
    kanjiThatUsesThis: {
        character: string
        meanings: string[]
    }[]
}

export interface KanjiSubject {
   character: string
   stroke_count: number
   freq: number | null
   grade: number | null
   kunyomi: string[]
   onyomi: string[]
   meanings: string[]
   readingMnemonic: string
   meaningMnemonic: string
   radicalsUsed: {
    character: string
    meaning: string
   }[]
   kanjiContainedWithinThis: {
    character: string
    meanings: string[]
   }[]
   vocabularyThatUsesThis: any
   mainMeaningsToUse: string[]
}

const jmdictTags = ['v5uru', 'v2g-s', 'dei', 'ship', 'leg', 'bra', 'music', 'quote', 'pref', 'ktb', 'rK', 'derog', 'abbr', 'exp', 'astron', 'v2g-k', 'aux-v', 'ctr', 'baseb', 'serv', 'genet', 'geogr', 'dent', 'v5k-s', 'horse', 'ornith', 'v2w-s', 'sK', 'hob', 'male', 'vidg', 'n-pref', 'n-suf', 'suf', 'hon', 'biol', 'pol', 'vulg', 'v2n-s', 'mil', 'golf', 'X', 'sk', 'sl', 'fict', 'art', 'stat', 'cryst', 'pathol', 'photo', 'food', 'n', 'thb', 'fish', 'v5r-i', 'arch', 'v1', 'bus', 'tv', 'euph', 'embryo', 'v2y-k', 'uk', 'rare', 'v2a-s', 'hanaf', 'agric', 'given', 'physiol', 'v5u-s', 'chn', 'ev', 'adv', 'prt', 'vi', 'v2y-s', 'kyb', 'vk', 'grmyth', 'vn', 'electr', 'gardn', 'adj-kari', 'vr', 'vs', 'vt', 'cards', 'stockm', 'vz', 'aux', 'v2h-s', 'kyu', 'noh', 'econ', 'rommyth', 'ecol', 'n-t', 'psy', 'proverb', 'company', 'poet', 'ateji', 'paleo', 'v2h-k', 'go', 'adv-to', 'ent', 'unc', 'unclass', 'on-mim', 'yoji', 'n-adv', 'print', 'form', 'obj', 'osb', 'adj-shiku', 'Christn', 'hum', 'obs', 'relig', 'iK', 'v2k-s', 'conj', 'v2s-s', 'geol', 'geom', 'anat', 'nab', 'ski', 'hist', 'fam', 'myth', 'gramm', 'v2k-k', 'id', 'v5aru', 'psyanal', 'comp', 'creat', 'ik', 'oth', 'v-unspec', 'io', 'work', 'adj-ix', 'phil', 'doc', 'math', 'pharm', 'adj-nari', 'v2r-k', 'adj-f', 'adj-i', 'audvid', 'rkb', 'adj-t', 'v2r-s', 'Buddh', 'biochem', 'v2b-k', 'vs-s', 'surname', 'physics', 'place', 'v2b-s', 'kabuki', 'product', 'vs-c', 'tsug', 'adj-ku', 'telec', 'vs-i', 'v2z-s', 'organization', 'char', 'engr', 'logic', 'v2m-s', 'col', 'archeol', 'cop', 'num', 'aviat', 'aux-adj', 'm-sl', 'fem', 'MA', 'finc', 'v1-s', 'v2m-k', 'manga', 'shogi', 'group', 'adj-no', 'adj-na', 'sens', 'law', 'mahj', 'v4b', 'rail', 'v4g', 'elec', 'film', 'mining', 'v4h', 'v4k', 'v4m', 'v4n', 'sumo', 'v4s', 'v4r', 'person', 'v4t', 'oK', 'cloth', 'joc', 'politics', 'v2t-k', 'tsb', 'v5b', 'ling', 'bot', 'v2t-s', 'v5g', 'med', 'v5k', 'mech', 'v5n', 'v5m', 'v2d-k', 'v5r', 'v5t', 'v5s', 'v5u', 'Shinto', 'station', 'dated', 'v2d-s', 'psych', 'adj-pn', 'ok', 'met', 'chem', 'sports', 'zool', 'int', 'tradem', 'net-sl', 'n-pr', 'archit', 'ksb', 'pn', 'gikun'] as const

type JmdictTagsType = typeof jmdictTags[number]

interface JMDictKanjiVocabFields {
    common: boolean
    text: string
    tags: JmdictTagsType[]
    jmdictEntry: number
 }
 
export interface JMDictKanjiVocab extends JMDictKanjiVocabFields {}

export interface JMDictKanaVocab extends JMDictKanjiVocabFields {
    appliesToKanji: string[]
}

interface JMDictLanguageSource {
    lang: string
    full: boolean
    wasei: boolean
    text: string | null
}
 
 const genderChoices = [
    "masculine",
    "feminine",
    "neuter"
 ]
 
 const glossTypeChoices = [
    "literal",
    "figurative",
    "explanation",
    "trademark"
 ]
 
interface JMDictGloss {
    lang: string
    gender: typeof genderChoices[number] | null
    type: typeof glossTypeChoices[number] | null
    text: string | null
    jmdictSense: number
}
 
export interface JMDictSense {
    partOfSpeech: JmdictTagsType[]
    appliesToKanji: string[]
    appliesToKana:string[]
    related: string[]
    antonym: string[]
    field: JmdictTagsType[]
    dialect: JmdictTagsType[]
    misc: JmdictTagsType[]
    info: string[]
    jmdictEntry: number
    languageSource: JMDictLanguageSource[]
    gloss: JMDictGloss[]
}

export interface JMDict {
    jmDictId: number
    kanjiVocabulary: JMDictKanjiVocab[]
    kanaVocabulary: JMDictKanaVocab[]
    sense: JMDictSense[]
}

export interface JapaneseVocabularySubjectAudioFiles {
    file: string
    lastHighPitch: number | null
}

interface JapaneseCounterVocab {
    character: string
    usage: string
    normalReading: string
    howToAskForHowMany: {
        characters: string
        reading: string
    }
    objectsThisIsUsedToCount: {
        singular: string
        plural: string
    }[]
    specialNumbers: {
        number: string
        reading: string
        explanation?: string
    }[]
}
export interface JapaneseVocabularySubject {
    kanjiThatThisUses: { character: string, meanings: string[]} []
    meaningMnemonic: string
    readingMnemonic: string
    mainMeaningsToUse: string[]
    mainTextRepresentation: string
    jmdict?: JMDict
    customQuestions: CustomSubjectQuestion[]
    audioFiles: JapaneseVocabularySubjectAudioFiles[]
    counterWordInfo?: JapaneseCounterVocab
    acceptableResponsesButNotWhatLookingFor: {
        response: string
        reason: string
    }[]
    differencesExplanations: SubjectDifferences[]
}

export interface JapaneseExerciseSubject {
    questionToAsk: string
    answers: string[]
    questionPrompt: string
    infoToDisplay: SubjectInfoToDisplay[]
}

export type GrammarFormality = 'standard' | 'very casual' | 'casual' | '謙譲語' | '尊敬語' | '丁寧語'

type GrammarQuestion = {
    questionType: 'fill in blank' | 'build sentence'
    questionText: string
    translations: {
        language: { name: LanguageType },
        translation: string
    }[]
}

export const GrammarFormalityAndDescriptions = {
    'standard': {
        nameForPresentation: 'Standard',
        description: 'This grammar is used in all types of conversations'
    },
    'very casual': {
        nameForPresentation: 'Very Casual',
        description: 'Mainly used with those very familiar and no need to be formal (e.g. sibling)'
    },
    'casual': {
        nameForPresentation: 'Casual',
        description: 'Mainly used with those you are familiar with'
    },
    '謙譲語': {
        nameForPresentation: 'Humble',
        description: 'Used to humble yourself or lower your rank to who you are speaking to. (e.g. talking to boss)'
    },
    '尊敬語': {
        nameForPresentation: 'Formal',
        description: 'Used when talking about people in positions of power. (e.g boss or even your own client at a store)'
    },
    '丁寧語': {
        nameForPresentation: 'Polite',
        description: "Used when talking to those you aren't familiar with (e.g strangers) or to show respect to someone like your sensei"
    }
  }

export interface GrammarSubject {
    examples: SubjectExample[]
    explanation: string
    formality: GrammarFormality
    formalityMattersForItsQuestions: boolean
    meaning: string
    name: string
    questions: GrammarQuestion[]
    structure: string
}

export type JapaneseSubjectData = (
    KanaSubject 
    | RadicalSubject 
    | KanjiSubject 
    | JapaneseVocabularySubject 
    | JapaneseExerciseSubject 
    | GrammarSubject
    ) & { 
    japaneseSubjectType: JapaneseSubjectType
    subjectId: number
    hasUniqueSubjectModel: boolean
    subjectType: string
    note?: string
}
