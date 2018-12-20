const express = require('express');
const db = require('../db');
// Class to be created in models...
const User = require('../models/user');
// below should only be utilized by Jobs Class
// const partialUpdate = require('../helpers/partialUpdate');
const sqlForPartialUpdate = require('../helpers/partialUpdate.js');
const { validateJobJSON } = require('../middleware/validation.js');

const router = new express.Router();

module.exports = router;
