import { get } from 'cypress/types/lodash'

describe('Stories', () => {
  before(() => {
    cy.login()
  })

  it('All stories can load', () => {
    cy.get('a').contains('Stories').click()
    const stories: string[] = []
    cy.get('.story-choice-link')
      .each(($storyChoice) => {
        // stories.push($storyChoice.text())
        // console.log($storyChoice.text(), ' in the each')
        cy.get('a').contains($storyChoice.text()).click()
        cy.get('a').contains('Stories').click()
        // console.log(story, ' in teh for loop')
      })
    // console.log(stories)
    // for (const story of stories) {
    //     cy.get('a').contains(story).click()
    //     cy.get('a').contains('Stories').click()
    //     console.log(story, ' in teh for loop')
    // }
  })
})
