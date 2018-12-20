/** Middleware for handling validation. */

const { validate } = require('jsonschema');
const companySchema = require('../schemas/companySchema.json');
// const message = require('../models/message');

async function validateJSON(req, res, next) {
  try {
    const result = validate(req.body, companySchema);
    console.log('INSIDE JSON VALIDATE', result);
    if (!result.valid) {
      let message = result.errors.map(error => error.stack);
      let status = 400;
      let error = new Error(message, status);
      return next(error);
    }

    return next();
  } catch (err) {
    return next({ status: 404, message: 'Invalid Inputs' });
  }
}

// TO DO: Add middleware for PATCH
module.exports = {
  validateJSON
};
