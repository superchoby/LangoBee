describe("Learning", () => {
    beforeEach(() => {
        cy.login()
      })
  
      context("Lessons", () => {
        it('User can go to lessons and click the level to view the concepts', () => {
            cy.visit('/lessons')
            // is an article button
            cy.get('button')
            .then($body => {
                if ($body.find(`[data-testid="read-this-levels-article-button"]`).length > 0) {
                    cy.get('button').contains('Here').click()
                    cy.get('button').contains('Start').click()
                    cy.get('button').contains('Back to Lesson').click()
                }
                cy.get('button').contains('Here').click()
                cy.get('button').contains('Start').click()
            })           
        })
        

        it('Lessons 1-20 are fine no errors loading', () => {
            Cypress.on('uncaught:exception', (err, runnable) => {
                if (err.message.includes('Failed to load because no supported source was found')) {
                  return false
            }})
            cy.fixture('fixture_0.json').as('usersData').then((userFixture) => {
                cy.visit('/lessons/session')
                
                // cy.get('.ReactModalPortal')
                // .then($body => {
                //     if ($body.find(`[data-testid="lessons-session-start-quiz-button"]`).length > 0) {
                //         cy.get('button').contains('Quiz me!').click()
                //     }
                    
                // })  
                cy.clickUntilVisible('.learning-forward-button', `[data-testid="lessons-session-start-quiz-button"]`)
                cy.get(`[data-testid="lessons-session-start-quiz-button"]`).click()
            })
        })
      })
      
})