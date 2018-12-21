// Middleware for handling authorization for routes
const db = require('../db');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config.js');

// ensure logged in for
// GET /jobs
// GET /jobs/[id]
// GET /companies
// GET /companies/[handle]
async function ensureLoggedIn(req, res, next) {
  try {
    const token = req.body._token || req.query._token;
    let { username } = jwt.verify(token, SECRET_KEY);
    // put username on request as a convenience for routes
    req.username = username;
    return next();
  } catch (error) {
    return next({ status: 401, message: 'Unauthorized' });
  }
}

// ensure correct user (same username) able to access
// PATCH /users/[username]
// PATCH /users/[username]
// DELETE /users/[username]
function ensureCorrectUser(req, res, next) {
  try {
    // extracting data that is stored in the token
    const token = req.body._token || req.query._token;

    // check that data within token from req matches the secret key:
    const payload = jwt.verify(token, SECRET_KEY);
    console.log('payload', payload, 'token', token);
    // username should exist inside the token payload - check that matches the current user
    if (payload.username === req.params.username) {
      // if correct data is found, move on to next function
      req.username = payload.username;
      return next();
    }
  } catch (err) {
    return next({ status: 401, message: 'Unauthorized' });
  }
}

//ensure only admin user can access this data
// POST / companies;
// POST / jobs;
// PATCH / companies / [handle];
// DELETE / companies / [handle];
// PATCH / jobs[id];
// DELETE / jobs / [id];
async function ensureAdminUser(req, res, next) {
  try {
    const token = req.body._token || req.query._token;
    const payload = jwt.verify(token, SECRET_KEY);

    let username = payload.username;

    const result = await db.query(
      `SELECT is_admin FROM users WHERE username = $1`,
      [username]
    );
    console.log('result for is_admin   ', result);
    if (result.rows[0] === true) {
      next();
    } else {
      throw new Error('User needs to be admin to view this page');
    }
  } catch (error) {
    return next({ status: 401, message: 'Unauthorized' });
  }
}

module.exports = {
  ensureLoggedIn,
  ensureCorrectUser,
  ensureAdminUser
};
