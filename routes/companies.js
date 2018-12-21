const express = require('express');
const db = require('../db');
// org tool to help build routes:u
// Class to be created in models...
const Company = require('../models/company');
const sqlForPartialUpdate = require('../helpers/partialUpdate.js');
const { validateCompanyJSON } = require('../middleware/validation.js');
const {
  ensureLoggedIn,
  ensureCorrectUser,
  ensureAdminUser
} = require('../middleware/auth.js');

const router = new express.Router();

// GET /companies
// This should return a the handle and name for all of the company objects. It should also allow for the following query string parameters
// search. If the query string parameter is passed, a filtered list of handles and names handles should be displayed based on the search term and if the name includes it.
router.get('/', ensureLoggedIn, async function(req, res, next) {
  try {
    console.log(req.query);
    const companies = await Company.searchCompanies(req.query);

    return res.json({ companies: companies });
  } catch (error) {
    error.status = 404;
    return next(error);
  }
});

router.post('/', validateCompanyJSON, ensureAdminUser, async function(
  req,
  res,
  next
) {
  try {
    const newCompany = await Company.create(req.body);
    return res.json({ company: newCompany });
  } catch (err) {
    err.status = 409; // conflict error
    return next(err);
  }
});

// Get company details by handle name in query param
router.get('/:handle', ensureLoggedIn, async function(req, res, next) {
  try {
    const companyData = await Company.getCompany(req.params.handle);
    return res.json({ company: companyData });
  } catch (err) {
    err.status = 404;
    return next(err);
  }
});

// Update company in query param by items passed in req. body
// CAN ADD OWN VALIDATION SCHEMA with 'optional' fields
router.patch('/:handle', ensureAdminUser, async function(req, res, next) {
  try {
    // ARGS: (table, items, key, id)
    const table = 'companies';
    const id = req.params.handle; // 'companies/google'

    const key = 'handle'; //hard-code key to equal handle
    // Alternate approach {
    // 	"columns": {
    // 		"description": "Terrribleee Company",
    // 		"logo_url": "http://www.ibm.com"
    // 	},
    // 	"primary_key": "handle",
    // 	"value": "goog"
    // }
    // console.log('key:', key);
    // console.log('obj:', req.params);

    const items = req.body;

    return res.json({
      companies: await sqlForPartialUpdate(table, items, key, id)
    });
  } catch (err) {
    return next(err);
  }
});

// Delete company in query param
router.delete('/:handle', ensureAdminUser, async function(req, res, next) {
  try {
    const companyData = await Company.deleteCompany(req.params.handle);
    console.log(companyData);
    return res.json({ message: 'Company deleted' });
  } catch (err) {
    err.status = 404;
    return next(err);
  }
});

// router.post('/with-validation', validateJSON, function(req, res, next) {
//   const result = validate(req.body, companySchema);
//   console.log('INSIDE JSON VALIDATE', result);
//   if (!result.valid) {
//     let message = result.errors.map(error => error.stack);
//     let status = 400;
//     let error = new Error(message, status);
//     return next(error);
//   }

//   return res.json(req.body);
// });

module.exports = router;
