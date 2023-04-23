describe("Learning", () => {
    before(() => {
        cy.exec('cd ../server && source venv/bin/activate && python3 manage.py reset_test_user')
    })
    
    beforeEach(() => {
        cy.login()
    })
  
    it('User can go to lessons and click the level to view the concepts', () => {
        cy.visit('/lessons')
        // is an article button
        cy.get('button')
        .then($body => {
            cy.get('button').contains('Here').click()
            cy.get('button').contains('Start').click()
            if ($body.find(`[data-testid="article-page"]`).length > 0) {
                cy.get('button').contains('Back to Lesson').click()
            }
        })           
    })
    
    context("Levels Can Be Completed", () => {
        Cypress.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('Failed to load because no supported source was found')) {
                return false
        }})
        const levelIncrements = 20
        for (let i=1; i<10; ++i) {
            const levelToCheckUpTo = levelIncrements * i
            const startingLevel = levelToCheckUpTo - (levelIncrements - 1)
            it(`Lessons ${startingLevel}-${levelToCheckUpTo} can be completed with no errors loading`, () => {
                cy.exec(`cd ../server && source venv/bin/activate && python3 manage.py change_level Japanese main ${startingLevel}`)
                cy.fixture(`AllOfCoursesSubjectsQuestions/${levelToCheckUpTo}.json`).as('quizAnswers').then((quizAnswers) => {
                    cy.visit('/lessons/session')
                    for (let i=0; i<20; ++i) {
                        cy.goThroughLessonsSubjects('.learning-forward-button', `[data-testid="lessons-session-start-quiz-button"]`)
                        cy.getByDataId("lessons-session-start-quiz-button").click()
                        cy.answerQuestions(quizAnswers)
                        cy.getByDataId('quiz-results-page-leave-button').click()
        
                        cy.get('button')
                        .then($body => {
                            if ($body.find(`[data-testid="read-this-levels-article-button"]`).length > 0) {
                                cy.get('button').contains('Here').click()
                                cy.get('button').contains('Start').click()
                                
                            }
                            cy.get('button').contains('Here').click()
                            cy.get('button').contains('Start').click()

                            // if cy.get('button').contains('Back to Lesson').click()
                        })   
                    }
                })
            })
        }
    })

    // it('Lessons 1-20 are fine no errors loading', () => {
    //     cy.fixture('AllSubjectsAnswers.json').as('quizAnswers').then((quizAnswers) => {
    //         Cypress.on('uncaught:exception', (err, runnable) => {
    //             if (err.message.includes('Failed to load because no supported source was found')) {
    //                 return false
    //         }})
    //         cy.visit('/lessons/session')
    //         for (let i=0; i<20; ++i) {
    //             cy.goThroughLessonsSubjects('.learning-forward-button', `[data-testid="lessons-session-start-quiz-button"]`)
    //             cy.getByDataId("lessons-session-start-quiz-button").click()
    //             cy.answerQuestions(quizAnswers)
    //             cy.getByDataId('quiz-results-page-leave-button').click()

    //             cy.get('button')
    //             .then($body => {
    //                 if ($body.find(`[data-testid="read-this-levels-article-button"]`).length > 0) {
    //                     cy.get('button').contains('Here').click()
    //                     cy.get('button').contains('Start').click()
    //                     cy.get('button').contains('Back to Lesson').click()
    //                 }
    //                 cy.get('button').contains('Here').click()
    //                 cy.get('button').contains('Start').click()
    //             })   
    //         }
    //     })
    // })
      
})