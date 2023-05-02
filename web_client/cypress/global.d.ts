declare namespace Cypress {
  import { type authService } from '../src/machines/authMachine'
  import { type createTransactionService } from '../src/machines/createTransactionMachine'
  import { type publicTransactionService } from '../src/machines/publicTransactionsMachine'
  import { type contactsTransactionService } from '../src/machines/contactsTransactionsMachine'
  import { type personalTransactionService } from '../src/machines/personalTransactionsMachine'
  import {
    User,
    BankAccount,
    Like,
    Comment,
    Transaction,
    BankTransfer,
    Contact
  } from '../src/models'

  interface CustomWindow extends Window {
    authService: typeof authService
    createTransactionService: typeof createTransactionService
    publicTransactionService: typeof publicTransactionService
    contactTransactionService: typeof contactsTransactionService
    personalTransactionService: typeof personalTransactionService
  }

  interface dbQueryArg {
    entity: string
    query: object | [object]
  }

  interface LoginOptions {
    rememberUser: boolean
  }

  interface Chainable {
    /**
     * Logs-in user by using UI
     */
    login(): void
    getByDataId(dataId: string): Chainable<JQuery<HTMLElement>>
    goThroughLessonsSubjects: (buttonToClick: string, buttonToAppear: string) => void
    answerQuestions: (answerData: {
      radical: Record<string, string[]>
      kana: Record<string, string[]>
      vocabulary: Record<string, {
        meaning: string[]
        reading: string[]
      }>
      kanji: Record<string, string[]>
      grammar: Record<string, string[][]>
    }) => void
  }
}
