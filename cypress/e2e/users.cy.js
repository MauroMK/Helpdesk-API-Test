import { generateFakeUser, createUser } from '../support/utils';
import { faker } from '@faker-js/faker';

describe('Users - Success Cases', () => {

  let user;
  let userId;

  before(() => {
    user = generateFakeUser();
  });

  it("Should successfully create a user", () => {
    createUser({ data: user }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      cy.log(`User created with ID ${response.body.id}`);
      userId = response.body.id;
    });
  });

  it("Should retrieve all users", () => {
    cy.request("GET", `/users`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      cy.log(`Total users returned: ${response.body.length}`);
    });
  });

  it("Should retrieve a user by ID", () => {
    expect(userId).to.exist;

    cy.request("GET", `/users/${userId}`).should((response) => {
      console.log("Specific user", response);
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', userId);
      expect(response.body).to.have.property('email', user.email);
    })
  });

  it("Should update an existing user's data", () => {
    const newName = `QA ${Date.now()}`;
    cy.request("PUT", `/users/${userId}`, { name: newName }).then((response) => {
      console.log("User updated", response);
      expect(response.status).to.eq(200);
      expect(response.body.user).to.have.property('name', newName);
      expect(response.body).to.have.property('message', "User updated successfully.");
    });
  });

  it("Should validate the schema of the returned user", () => {
    cy.request(`GET`, `/users/${userId}`).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.all.keys('id', 'name', 'email');
      expect(response.body.id).to.be.a('number');
      expect(response.body.name).to.be.a('string');
      expect(response.body.email).to.include('@');
    });
  });

  it("Should delete a newly created user", () => {
    cy.request("DELETE", `/users/${userId}`).then((response) => {
      expect(response.status).to.be.oneOf([200, 204]);
    });
  });

  it("Should not find the deleted user", () => {
    cy.request({
      method: 'GET',
      url: `/users/${userId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'User not found.');
    });
  });

});

describe('User - Error Handling', () => {

  it("Should not allow user creation without name", () => {
    createUser({
      data: { email: generateFakeUser().email },
      acceptError: true
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'The fields name and email are required.');
    });
  });

  it("Should not allow user creation without email", () => {
    createUser({
      data: { name: generateFakeUser().name },
      acceptError: true
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'The fields name and email are required.');
    });
  });

  it('Should not allow user creation with duplicate name', () => {
    const name = faker.person.fullName();
    const email1 = faker.internet.email();
    const email2 = faker.internet.email();

    // First user
    cy.request('POST', '/users', { name, email: email1 }).then((response1) => {
      expect(response1.status).to.eq(201);

      // Attempt to create another user with the same name, but different email
      cy.request({
        method: 'POST',
        url: '/users',
        failOnStatusCode: false,
        body: { name, email: email2 }
      }).then((response2) => {
        expect(response2.status).to.eq(409);
        expect(response2.body).to.have.property('error', 'A user with this name or email already exists.');
      });
    });
  });

  it('Should not allow user creation with duplicate email', () => {
    const name1 = faker.person.fullName();
    const name2 = faker.person.fullName();
    const email = faker.internet.email();

    // First user
    cy.request('POST', '/users', { name: name1, email }).then((response1) => {
      expect(response1.status).to.eq(201);

      // Attemp to create another user with the same email, but different name
      cy.request({
        method: 'POST',
        url: '/users',
        failOnStatusCode: false,
        body: { name: name2, email }
      }).then((response2) => {
        expect(response2.status).to.eq(409);
        expect(response2.body).to.have.property('error', 'A user with this name or email already exists.');
      });
    });
  });

  it('Should return error when trying to update a non-existent user', () => {
    const fakeUserId = 999999;

    cy.request({
      method: 'PUT',
      url: `/users/${fakeUserId}`,
      failOnStatusCode: false,
      body: {
        name: faker.person.fullName()
      }
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'User not found.');
    });
  });

})