describe("Learning", () => {
    before(() => {
        cy.login()
      })
  
      context("Lessons", () => {
        it('User can go to lessons and finsih them', () => {
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
            
            for (let i=0;i<5;++i) {
                cy.get('.learning-forward-button').click()
            }       
            
            cy.getByDataId('lessons-session-start-quiz-button').click()
          })
      })
      
})