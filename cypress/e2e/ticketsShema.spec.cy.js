import { generateFakeUser, createUser, generateFakeTicket, createTicket } from '../support/utils';

describe('Ticket Schema Validation', () => {
  let ticketId;

  before(() => {
    const user = generateFakeUser();
    createUser({ data: user }).then((response) => {
      const userId = response.body.id;
      const ticket = generateFakeTicket({ userId });

      createTicket({ data: ticket }).then((resTicket) => {
        ticketId = resTicket.body.id;
      });
    });
  });

  it('Should validate the schema of a ticket', () => {
    cy.request('GET', `/tickets/${ticketId}`).then((response) => {
      expect(response.status).to.eq(200);

      cy.fixture('ticket-schema.json').then((schema) => {
        cy.schemaValidation(schema, [response.body]);
      });
    });
  });
});