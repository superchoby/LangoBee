declare namespace Cypress {
  import { authService } from "../src/machines/authMachine";
  import { createTransactionService } from "../src/machines/createTransactionMachine";
  import { publicTransactionService } from "../src/machines/publicTransactionsMachine";
  import { contactsTransactionService } from "../src/machines/contactsTransactionsMachine";
  import { personalTransactionService } from "../src/machines/personalTransactionsMachine";
  import {
    User,
    BankAccount,
    Like,
    Comment,
    Transaction,
    BankTransfer,
    Contact,
  } from "../src/models";

  interface CustomWindow extends Window {
    authService: typeof authService;
    createTransactionService: typeof createTransactionService;
    publicTransactionService: typeof publicTransactionService;
    contactTransactionService: typeof contactsTransactionService;
    personalTransactionService: typeof personalTransactionService;
  }

  type dbQueryArg = {
    entity: string;
    query: object | [object];
  };

  type LoginOptions = {
    rememberUser: boolean;
  };

  interface Chainable {
    /**
     * Logs-in user by using UI
     */
    login(): void;
    getByDataId(dataId: string): Chainable<JQuery<HTMLElement>>;
    clickUntilVisible: (buttonToClick: string, buttonToAppear: string) => void;
  }
}