describe('User Schema Validation', () => {
  before(() => {
    cy.request('GET', '/users').then((response) => {
      expect(response.status).to.equal(200);
      cy.wrap(response.body).as('responseBody');
    });
  });

  it('Should validate the schema of the users', function () {
    cy.fixture('user-schema.json').then((schema) => {
      const schemaPosts = schema.paths["/posts"].get.responses["200"].content["application/json"].schema;

      cy.get('@responseBody').then((responseBody) => {
        cy.schemaValidation(schemaPosts, responseBody);
      });
    });
  });
});