// Middleware for handling authorization for routes

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config.js');

// ensure logged in for
// GET /jobs
// GET /jobs/[id]
// GET /companies
// GET /companies/[handle]
function ensureLoggedIn(req, res, next) {}

// ensure correct user (same username) able to access
// PATCH /users/[username]
// PATCH /users/[username]
// DELETE /users/[username]
function ensureCorrectUser(req, res, next) {}

//ensure only admin user can access this data
// POST / companies;
// POST / jobs;
// PATCH / companies / [handle];
// DELETE / companies / [handle];
// PATCH / jobs[id];
// DELETE / jobs / [id];
function ensureAdminUser(req, res, next) {}
