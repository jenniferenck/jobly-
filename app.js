/** Express app for jobly. */

const express = require('express');
const app = express();
app.use(express.json());
const APIError = require('./helpers/APIError');

// add logging system

const morgan = require('morgan');
app.use(morgan('tiny'));

/** routes */

const companyRoutes = require('./routes/companies');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

app.use('/companies', companyRoutes);
app.use('/jobs', jobRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.get('*', function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});

// global error handler
app.use(function(err, req, res, next) {
  // all errors that get to here get coerced into API Errors

  if (!(err instanceof APIError)) {
    err = new APIError(err.message, err.status);
  }
  return res.status(err.status).json(err);
});

module.exports = app;
