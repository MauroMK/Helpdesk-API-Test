## Helpdesk-API-Test
Test Automation Challenge - Helpdesk API

## Technologies Used

- [Cypress](https://www.cypress.io/)
- [Faker.js](https://www.npmjs.com/package/@faker-js/faker)
- [MochaAwesome](https://www.npmjs.com/package/mochawesome)

## Prerequisites

- Node.js (v14 or higher)
- Package manager `npm` or `yarn`
- Helpdesk API running locally at `http://localhost:3000`

## How to Run the Tests

1. Clone the Helpdesk API repository

- git clone https://github.com/automacaohml/helpdesk-api.git
- cd helpdesk-api

2. Install the dependencies

- npm install

3. Start the API server

- node server.js

4. Clone this test repository

- git clone https://github.com/MauroMK/Helpdesk-API-Test
- cd helpdesk-api-tests
- npm install

5. Run the tests

- npx cypress open

- npx cypress run (to generate mochawesome reports)