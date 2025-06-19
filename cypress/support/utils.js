import { faker } from '@faker-js/faker';

export function gerarUsuarioFake(overrides = {}) {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    ...overrides
  };
}

export function criarUsuario({ dados, aceitarErro = false }) {
  return cy.request({
    method: "POST",
    url: "/users",
    body: dados,
    failOnStatusCode: !aceitarErro
  });
}