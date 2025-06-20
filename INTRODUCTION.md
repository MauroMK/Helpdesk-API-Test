## 🔍 Covered Features

This project includes automated tests for a Helpdesk API, covering both users and tickets functionalities.

## Test structure

- `cypress/e2e/users.spec.js`: tests related to user creation, update, deletion, and validation.
- `cypress/e2e/tickets.spec.js`: tests related to ticket creation, update, deletion, and validation.
- `cypress/support/utils.js`: reusable helper functions, such as fake data generation and request utilities.

---

### 🔹 Users

- User creation with valid data
- Validation of required fields (`name`, `email`)
- Prevention of creation with duplicate name or email
- User data update
- Retrieval by ID
- User deletion
- Schema and status code validation
- Error validation when attempting to update a non-existent user

### 🔹 Tickets

- Ticket creation with a valid `userId`
- Validation of required fields (`userId`, `description`)
- Retrieval by ID
- Status update
- Ticket deletion and confirmation of removal
- Error validation when using a non-existent `userId`
- Schema and status code validation
- Error validation when attempting to update a non-existent ticket

---

### 🔹 Suggestions for Improvement

- Implement field-level validation for emails (e.g., invalid formats like "abc.com")
- Add pagination and filtering to `/users` and `/tickets` endpoints
- Return more detailed error messages (e.g., which field is invalid)
- Add authentication and authorization to protect endpoints