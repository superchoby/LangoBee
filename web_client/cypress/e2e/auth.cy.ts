
describe('Auth', () => {
    before(() => {
      cy.exec('cd ../server && source venv/bin/activate && python3 manage.py delete_test_user')
    })

    it('User can signup and login', () => {
      cy.visit('http://localhost:3000/signup')
      cy.fixture('fake_user.json').as('usersData').then((userFixture) => {
        cy.get('input[placeholder="Username"]').type(userFixture.username);
        cy.get('input[placeholder="Email"]').type(userFixture.email);
        cy.get('input[placeholder="Password"]').type(userFixture.password);
        cy.get('input[placeholder="Reenter Password"]').type(userFixture.password);
        cy.get('button').click()
        cy.get('img[alt="profile-icon"]').click()
        cy.get('li').contains('Logout').click()
        cy.get('input[placeholder="Username or email"]').type(userFixture.username);
        cy.get('input[placeholder="Password"]').type(userFixture.password);
        cy.get('button').contains('LOGIN').click()
        cy.location("pathname").should("eq", "/home")
      })
    })
  })