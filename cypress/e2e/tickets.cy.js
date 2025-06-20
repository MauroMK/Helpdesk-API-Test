import { generateFakeUser, createUser, generateFakeTicket, createTicket } from '../support/utils';
import { faker } from '@faker-js/faker';

describe('Tickets - Success Cases', () => {

  let ticketId;
  let userId;
  const statusOptions = ['On Hold', 'In Progress', 'Closed'];

  before(() => {
    const user = generateFakeUser();
    createUser({ data: user }).then((response) => {
      userId = response.body.id;
      cy.log(`User created with ID: ${userId}`);
    });
  });

  it('Should create a succesfuly ticket', () => {
    const ticket = generateFakeTicket({ userId });

    createTicket({ data: ticket }).then((response) => {
      console.log("Created ticket", response);
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body).to.include({
        userId: ticket.userId,
        description: ticket.description,
        status: 'Open'
      });
      ticketId = response.body.id;
    });
  });

  it('Should retrieve a ticket by ID', () => {
    cy.request("GET", `/tickets/${ticketId}`).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', ticketId);
      expect(response.body).to.have.all.keys('id', 'userId', 'description', 'status', 'createdAt');
    });
  });

  it('Should update the ticket status', () => {
    const chosenStatus = faker.helpers.arrayElement(statusOptions);

    cy.request("PUT", `/tickets/${ticketId}/status`, {
      status: chosenStatus
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.ticket).to.have.property('status', chosenStatus);
    });
  });

  it('Should delete the created ticket', () => {
    cy.request("DELETE", `/tickets/${ticketId}`).then((response) => {
      cy.log(`Ticket with id: ${ticketId} deleted`);
      expect(response.status).to.be.oneOf([200, 204]);
      expect(response.body).to.have.property('message', 'Ticket deleted successfully.')
    });
  });

  it('Should not find the deleted ticket', () => {
    cy.request({
      method: "GET",
      url: `/tickets/${ticketId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Ticket not found.');
    });
  });

});

describe('Tickets - Error Handling', () => {

  const fakeTicketId = 999999;

  it('Should not allow ticket creation without userId', () => {
    const ticket = generateFakeTicket();
    delete ticket.userId;

    createTicket({ data: ticket, acceptError: true }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'The fields userId and description are required.');
    });
  });

  it('Should not allow ticket creation without description', () => {
    const ticket = generateFakeTicket();
    delete ticket.description;

    createTicket({ data: ticket, acceptError: true }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'The fields userId and description are required.');
    });
  });

  it('Should not allow ticket creation with non-existent userId', () => {
    const fakeUserId = 999999;

    cy.request({
      method: 'POST',
      url: '/tickets',
      failOnStatusCode: false,
      body: {
        userId: fakeUserId,
        description: faker.lorem.sentence()
      }
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error');
      expect(response.body.error.toLowerCase()).to.include('user');
    });
  });

  it('Should return error when trying to retrieve a ticket with wrong Id', () => {
    cy.request({
      method: 'GET',
      url: `/tickets/${fakeTicketId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Ticket not found.');
    });
  });

  it('Should return error when trying to update a non-existent ticket status', () => {
    cy.request({
      method: 'PUT',
      url: `/tickets/${fakeTicketId}/status`,
      failOnStatusCode: false,
      body: {
        status: 'Closed'
      }
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Ticket not found.');
    });
  });
})