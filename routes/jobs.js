const express = require('express');
const db = require('../db');
// Class to be created in models...
const Job = require('../models/job');
// below should only be utilized by Jobs Class
// const partialUpdate = require('../helpers/partialUpdate');
const sqlForPartialUpdate = require('../helpers/partialUpdate.js');
const { validateJobJSON } = require('../middleware/validation.js');
const { ensureLoggedIn, ensureAdminUser } = require('../middleware/auth.js');

const router = new express.Router({ mergeParams: true });

// GET/ SEARCH by job
router.get('/', ensureLoggedIn, async function(req, res, next) {
  try {
    // console.log(req.query);
    const jobs = await Job.searchJobs(req.query);
    return res.json({ jobs: jobs });
  } catch (error) {
    error.status = 404;
    return next(error);
  }
});

// POST new job
// Should edit this to IF ERROR THROW
router.post('/', validateJobJSON, ensureAdminUser, async function(
  req,
  res,
  next
) {
  try {
    // console.log('req.body is ', req.body);
    let jobData = await Job.create(req.body);
    // console.log(jobData);
    return res.json({ jobs: jobData });
  } catch (err) {
    err.status = 409; // conflict error
    return next(err);
  }
});

// GET job by id

router.get('/:id', ensureLoggedIn, async function(req, res, next) {
  try {
    let jobData = await Job.getJob(req.params.id);
    return res.json({ job: jobData[0] });
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

// PATCH/ update job by id
router.patch('/:id', ensureAdminUser, async function(req, res, next) {
  try {
    // send partial data change updates to db
    console.log(req.params.id);
    const table = 'jobs';
    const items = req.body;
    const key = 'id';
    const id = req.params.id;
    // console.log('table:', table, 'items:', items, 'key:', key, 'id:', id);
    const result = await Job.updateJob(table, items, key, id);

    return res.json(result);
  } catch (error) {
    error.status = 404;
    return next(error);
  }
});

// DELETE job by id

router.delete('/:id', ensureAdminUser, async function(req, res, next) {
  try {
    // take id and delete company
    const id = req.params.id;
    console.log('this id should be 5 in route -----', id);
    const deletedJob = await Job.deleteJob(id);
    // console.log(deletedJob);

    // return res.json('Job successfully deleted');
    return res.json(
      `Job id: ${id} for ${deletedJob.title} successfully deleted`
    );
  } catch (error) {
    error.status = 404;
    return next(error);
  }
});

module.exports = router;
