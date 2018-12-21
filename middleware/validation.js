/** Middleware for handling validation. */

const { validate } = require('jsonschema');
const companySchema = require('../schemas/companySchema.json');
const jobSchema = require('../schemas/jobSchema.json');
const userSchema = require('../schemas/userSchema.json');
// const message = require('../models/message');

async function validateCompanyJSON(req, res, next) {
  try {
    const result = validate(req.body, companySchema);
    // console.log('INSIDE JSON VALIDATE', result);
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

async function validateJobJSON(req, res, next) {
  try {
    const result = validate(req.body, jobSchema);
    // console.log('INSIDE JSON VALIDATE', result);
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

async function validateUserJSON(req, res, next) {
  try {
    const result = validate(req.body, userSchema);
    // console.log('INSIDE JSON VALIDATE', result);
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
  validateCompanyJSON,
  validateJobJSON,
  validateUserJSON
};
