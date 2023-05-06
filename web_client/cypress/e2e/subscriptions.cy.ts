
describe('Auth', () => {
    before(() => {
        cy.exec('cd ../server && source venv/bin/activate && python3 manage.py reset_test_user')
        cy.login()
    })

    it('User can signup and login', () => {
      cy.visit('/subscription')
      cy.getByDataId('subscription-option-button-for-Monthly').click()
      cy.origin('https://checkout.stripe.com', () => {

      // cy.get('input')

      })
     
    })
  })