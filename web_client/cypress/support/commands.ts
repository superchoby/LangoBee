Cypress.Commands.add('login', () => {
    cy.visit('/login')
    cy.fixture('fake_user.json').as('usersData').then((userFixture) => {
        cy.get('input[placeholder="Username or email"]').type(userFixture.username);
        cy.get('input[placeholder="Password"]').type(userFixture.password);
        cy.get('button').contains('LOGIN').click()
        cy.location("pathname").should("eq", "/home")
      })
})

Cypress.Commands.add('getByDataId', (dataId) => {
  return cy.get(`[data-testid=${dataId}]`)
})

Cypress.Commands.add('goThroughLessonsSubjects', (buttonToClick: string, buttonToAppear: string) => {
  cy.get('.ReactModalPortal')
  .then($body => {
      if ($body.find(buttonToAppear).length > 0) {
          return 
      } else {
        cy.get(buttonToClick).click()
        cy.goThroughLessonsSubjects(buttonToClick, buttonToAppear);
      }
  })  
});

Cypress.Commands.add('answerQuestions', (answerData) => {
  cy.getByDataId('quiz-generator-container')
  .then($body => {
      if ($body.find(`[data-testid="kana-vocab-question-container"]`).length > 0) {
        
          cy.get('[data-testid="quiz-generator-container"]')
          .find('.kana-vocab-question-text')
          .then($el => {
            cy.get('input').type(answerData[$el[0].innerText].answers[0])
            cy.get('button').contains('Check').click()
            cy.get('button').contains('Continue').click()
            if ($body.find('Finish').length === 0) {
              cy.answerQuestions(answerData)
            }
        })
      } else {
        // cy.get(buttonToClick).click()
        // cy.goThroughLessonsSubjects(buttonToClick, buttonToAppear);

      }
  })  
});
