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