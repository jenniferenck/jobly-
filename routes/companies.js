const express = require('express');
const companyRoutes = express();
const db = require('../db');
// what does BELOW DO?
const Router = require('express').Router;
// Class to be created in models...
const Company = require('../models/company');
const partialUpdate = require('../helpers/partialUpdate');
const sqlForPartialUpdate = require('../helpers/partialUpdate.js');

const router = new Router();

// GET /companies
// This should return a the handle and name for all of the company objects. It should also allow for the following query string parameters
// search. If the query string parameter is passed, a filtered list of handles and names handles should be displayed based on the search term and if the name includes it.
companyRoutes.get('/', async function(req, res, next) {
  try {
    console.log(req.query);
    const companies = await Company.searchCompanies(req.query, next);

    return res.json({ companies: companies });
  } catch (error) {
    return next(error);
  }
});

companyRoutes.post('/', async function(req, res, next) {
  try {
    const newCompany = await Company.create(req.body);
    return res.json({ company: newCompany });
  } catch (err) {
    return next(err);
  }
});

// Get company details by handle name in query param
companyRoutes.get('/:handle', async function(req, res, next) {
  try {
    const companyData = await Company.getCompany(req.params.handle);
    return res.json({ company: companyData });
  } catch (err) {
    return next(err);
  }
});

// Update company in query param by items passed in req. body
companyRoutes.patch('/:handle', async function(req, res, next) {
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
    console.log('key:', key);
    console.log('obj:', req.params);

    const items = req.body;

    return res.json({
      companies: await sqlForPartialUpdate(table, items, key, id)
    });
  } catch (err) {
    return next(err);
  }
});

// Delete company in query param
companyRoutes.delete('/:handle', async function(req, res, next) {
  try {
    const companyData = await Company.deleteCompany(req.params.handle);
    console.log(companyData);
    return res.json({ message: 'Company deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = companyRoutes;
