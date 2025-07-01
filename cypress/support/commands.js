import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Add a custom Cypress command for schema validation
Cypress.Commands.add('schemaValidation', (schema, data) => {
  // Initialize AJV with strict mode enabled
  const ajv = new Ajv({ strict: true });
  addFormats(ajv); // Add format support (e.g., date-time, email)

  // Compile the schema
  const validate = ajv.compile(schema);

  // Perform validation
  const valid = validate(data);

  if (!valid) {
    // Log validation errors in a readable format
    cy.log('Schema validation failed. Errors:', JSON.stringify(validate.errors, null, 2));
    console.error('Schema validation errors:', validate.errors);

    // Throw an error with the validation issues
    throw new Error(`Schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
  }

  // Assert that the validation passed
  expect(valid).to.be.true;
});