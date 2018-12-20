const express = require('express');
const jobRoutes = express();
const db = require('../db');
// what does BELOW DO?
const Router = require('express').Router;
// Class to be created in models...
const Job = require('../models/job');
// below should only be utilized by Jobs Class
// const partialUpdate = require('../helpers/partialUpdate');
// const sqlForPartialUpdate = require('../helpers/partialUpdate.js');
const { validateJSON } = require('../middleware/validation.js');

const router = new Router();

// GET/ SEARCH by job

// POST new job

// GET job by id

// PATCH/ update job by id

// DELETE job by id

module.exports = jobRoutes;
