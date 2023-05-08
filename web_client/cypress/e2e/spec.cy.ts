
describe('sign up works', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/signup')
    cy.fixture('fake_user.json').as('usersData').then((userFixture) => {
      cy.get('input[placeholder="Username"]').type(userFixture.username)
      cy.get('input[placeholder="Email"]').type(userFixture.email)
      cy.get('input[placeholder="Password"]').type(userFixture.password)
      cy.get('input[placeholder="Reenter Password"]').type(userFixture.password)
      cy.get('button').click()
    })
  })
})
