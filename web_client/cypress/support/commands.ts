Cypress.Commands.add('login', () => {
  cy.visit('/login')
  cy.fixture('fake_user.json').as('usersData').then((userFixture) => {
    cy.get('input[placeholder="Username or email"]').type(userFixture.username)
    cy.get('input[placeholder="Password"]').type(userFixture.password)
    cy.get('button').contains('LOGIN').click()
    cy.location('pathname').should('eq', '/home')
  })
})

Cypress.Commands.add('getByDataId', (dataId) => {
  return cy.get(`[data-testid=${dataId}]`)
})

Cypress.Commands.add('goThroughLessonsSubjects', (buttonToClick: string, buttonToAppear: string) => {
  cy.get('.ReactModalPortal')
    .then($body => {
      if ($body.find(buttonToAppear).length > 0) {

      } else {
        cy.get(buttonToClick).click()
        cy.goThroughLessonsSubjects(buttonToClick, buttonToAppear)
      }
    })
})

Cypress.Commands.add('answerQuestions', (answerData) => {
  cy.getByDataId('quiz-generator-container')
    .then($body => {
      if ($body.find('[data-testid="kana-vocab-question-container"]').length > 0) {
        cy.get('[data-testid="quiz-generator-container"]')
          .find('.kana-vocab-question-subject-type')
          .then($el => {
            const subjectType: 'radical' | 'kana' | 'vocabulary' | 'kanji' | 'grammar' = $el[0].innerText.toLowerCase() as 'radical' | 'kana' | 'vocabulary' | 'kanji' | 'grammar'
            cy.get('[data-testid="quiz-generator-container"]')
              .find('.kana-vocab-question-text')
              .then($el => {
                switch (subjectType) {
                  case 'radical':
                    cy.get('input').type(answerData.radical[$el[0].innerText][0])
                    break
                  case 'kana':
                    cy.get('input').type(answerData.kana[$el[0].innerText][0])
                    break
                  case 'kanji':
                    cy.get('input').type(answerData.kanji[$el[0].innerText][0])
                    break
                  case 'vocabulary':
                    cy.get('input')
                      .then($input => {
                        const placeholder: string = $input.attr('placeholder')!
                        const vocabInfo = answerData.vocabulary[$el[0].innerText]
                        if (placeholder.toLowerCase() === 'meaning') {
                          const meaningInfo = vocabInfo.meaning
                          cy.wrap($input).type(meaningInfo[Math.floor(Math.random() * meaningInfo.length)])
                        } else {
                          const readingInfo = vocabInfo.reading
                          cy.wrap($input).type(readingInfo[Math.floor(Math.random() * readingInfo.length)])
                        }
                      })
                    break
                  default:
                    throw new Error('uh oh unhandled case')
                }
              })
          })
      } else {
        cy.getByDataId('grammar-question-container')
          .find('[data-testid="grammar-question-components"]')
          .then($el => {
            const grammarInfo = answerData.grammar[$el[0].innerText]
            const inputAnswers = grammarInfo[Math.floor(Math.random() * grammarInfo.length)]
            cy.get('input')
              .each(($input, index) => {
                cy.wrap($input).type(inputAnswers[index])
              })
          })
      }

      cy.get('button').contains('Check').click()
      cy.get('button').then($button => {
        if ($button.text() === 'Continue') {
          cy.wrap($button).click()
          cy.answerQuestions(answerData)
        } else if ($button.text() === 'Finish') {
          cy.wrap($button).click()
        }
      })
    })
})
