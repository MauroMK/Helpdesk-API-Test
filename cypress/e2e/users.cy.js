import { faker } from '@faker-js/faker';

describe('User tests', () => {

  const randomName = faker.person.fullName();
  const randomEmail = faker.internet.email();

  let userId;

  it("Deve criar um novo usuário com sucesso", () => {
    cy.request("POST", `/users`, {
      name: randomName,
      email: randomEmail,
    }).should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      userId = response.body.id;
    });
  });

  it("Deve trazer os usuários", () => {
    cy.request("GET", `/users`).should((response) => {
      console.log("All users", response);
      expect(response.status).to.eq(200);
    });
  });

  it("Deve trazer um usuário existente por ID", () => {
    cy.wrap(null).should(() => {
      expect(userId).to.exist;
    });

    cy.request("GET", `/users/${userId}`).should((response) => {
      console.log("Specific user", response);
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', userId);
    })
  });

  it("Deve atualizar os dados de um usuário existente", () => {
    cy.wrap(null).should(() => {
      expect(userId).to.exist;
    });

    cy.request("PUT", `/users/${userId}`, {
      name: `mauro${Date.now()}`
    }).then((response) => {
      expect(response.status).to.eq(200);
      //expect(response.body.user).to.have.property('name', "Mauro Alteradoo");
    });
  });

  it('Deve deletar um usuário recém criado', () => {
    cy.wrap(null).should(() => {
      expect(userId).to.exist;
    });

    cy.request("DELETE", `/users/${userId}`).then((response) => {
      console.log("Delete user", response);
      expect(response.status).to.eq(200);
    })
  });

});