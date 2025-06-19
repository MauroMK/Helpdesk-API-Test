import { gerarUsuarioFake, criarUsuario } from '../support/utils';

describe('User tests', () => {

  let user;
  let userId;

  before(() => {
    user = gerarUsuarioFake();
  });

  it("Deve criar um novo usuário com sucesso", () => {
    criarUsuario({ dados: user }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      cy.log(`Usuário criado com ID ${response.body.id}`);
      userId = response.body.id;
    });
  });

  it("Deve trazer os usuários", () => {
    cy.request("GET", `/users`).should((response) => {
      console.log("All users", response);
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
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
      expect(response.body).to.have.property('email', user.email);
    })
  });

  it("Deve atualizar dados de um usuário", () => {
    const novoNome = `QA ${Date.now()}`;
    cy.request("PUT", `/users/${userId}`, { name: novoNome }).then((response) => {
      console.log("Usuario atualizado", response);
      expect(response.status).to.eq(200);
      expect(response.body.user).to.have.property('name', novoNome);
      expect(response.body).to.have.property('message', "User updated successfully.");
    });
  });

  it("Deve validar schema do usuário retornado", () => {
    cy.request(`GET`, `/users/${userId}`).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.all.keys('id', 'name', 'email');
      expect(response.body.id).to.be.a('number');
      expect(response.body.name).to.be.a('string');
      expect(response.body.email).to.include('@');
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

  it("Não deve encontrar o usuário deletado", () => {
    cy.request({
      method: 'GET',
      url: `/users/${userId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error');
    });
  });

});

describe('User Tests com erro', () => {

  it('Não deve permitir criar usuário sem nome', () => {
    cy.request({
      method: "POST",
      url: `/users`,
      body: {
        email: faker.internet.email(),
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'The fields name and email are required.');
    });
  });

  it('Não deve permitir criar usuário sem email', () => {
    cy.request({
      method: "POST",
      url: `/users`,
      body: {
        name: faker.person.fullName()
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'The fields name and email are required.');
    });
  });

})