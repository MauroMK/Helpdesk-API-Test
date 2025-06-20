import { faker } from '@faker-js/faker';

export function generateFakeUser(overrides = {}) {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    ...overrides
  };
}

export function createUser({ data, acceptError = false }) {
  return cy.request({
    method: "POST",
    url: "/users",
    body: data,
    failOnStatusCode: !acceptError
  });
}

export function generateFakeTicket(overrides = {}) {
  return {
    userId: overrides.userId || 1,
    description: faker.lorem.sentence(),
  };
}

export function createTicket({ data, acceptError = false }) {
  return cy.request({
    method: "POST",
    url: "/tickets",
    body: data,
    failOnStatusCode: !acceptError
  });
}