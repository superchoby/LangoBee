import {
  VerbsDictionaryFormAndVerbGroups,
  VerbsMasuForm,
  VerbsNaiForm,
  JapaneseWritingSystem
} from './ArticlesLibrary'

import './index.scss'

// type ArticlesCategory = 'Verbs'
// type ArticlesListType = Array<{
//   category: ArticlesCategory
//   articles: Array<{
//     url: string
//     title: string
//     component: JSX.Element
//   }>
// }>

type ArticleCategory = 'Verbs' | 'Japanese'

interface ArticlesDictType {
  [id: number]: {
    url: string
    title: string
    component: JSX.Element
    category: ArticleCategory
  }
}

export const ArticlesDict: ArticlesDictType = {
  7771798: {
    component: <VerbsDictionaryFormAndVerbGroups />,
    url: 'verbs-dictionary-form-and-verb-groups',
    title: 'Dictionary Form and Verb Groups',
    category: 'Verbs'
  },
  2665241: {
    component: <VerbsMasuForm />,
    url: 'verbs-masu-form',
    title: 'Formal, Present Tense Verbs (ます Form)',
    category: 'Verbs'
  },
  1381384: {
    component: <VerbsNaiForm />,
    url: 'verbs-nai-form',
    title: 'Casual, Negative Verbs (ない Form)',
    category: 'Verbs'
  },
  1832759: {
    component: <JapaneseWritingSystem />,
    url: 'japanese-writing-system',
    title: 'The Japanese Writing System',
    category: 'Japanese'
  }
}

export const ArticlesUrls = {
  verbsDictionaryForm: '/articles/verbs/verbs-dictionary-form-and-verb-groups',
  verbsMasuForm: '/articles/verbs/verbs-masu-form',
  verbsDictionaryFormAndVerbGroups: '/articles/verbs/verbs-dictionary-form-and-verb-groups',
  japaneseWritingSystem: '/articles/japanese/japanese-writing-system'
} as const
