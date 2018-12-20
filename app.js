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

app.use('/companies', companyRoutes);
app.use('/jobs', jobRoutes);
app.use('/users', userRoutes);

// global error handler
app.use(function(err, req, res, next) {
  // all errors that get to here get coerced into API Errors
  if (!(err instanceof APIError)) {
    err = new APIError(err.message, err.status);
  }
  return res.status(err.status).json(err);
});

/** 404 handler */

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;
