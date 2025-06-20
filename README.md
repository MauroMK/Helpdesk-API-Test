# Helpdesk-API-Test
Desafio de Automação de Testes - Helpdesk API

## 📦 Tecnologias utilizadas

- [Cypress](https://www.cypress.io/)
- [Faker.js](https://www.npmjs.com/package/@faker-js/faker)
- [MochaAwesome](https://www.npmjs.com/package/mochawesome)

## 📁 Pré-requisitos

- Node.js (v14 ou superior)
- Gerenciador de pacotes `npm` ou `yarn`
- API do Helpdesk rodando localmente em `http://localhost:3000`

## Como realizar os testes

1. Clonar o repositório da API helpdesk

- git clone https://github.com/automacaohml/helpdesk-api.git
- cd helpdesk-api

2. Instalar as dependências

- npm install

3. Iniciar a API

- node server.js

4. Clonar este repositório

- git clone https://github.com/MauroMK/Helpdesk-API-Test
- cd helpdesk-api-tests
- npm install

5. Execute os testes

- npx cypress open

- npx cypress run (para gerar o relatório do mochawesome)