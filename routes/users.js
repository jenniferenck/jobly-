const express = require('express');
const db = require('../db');
// Class to be created in models...
const User = require('../models/user');
// below should only be utilized by Jobs Class
// const partialUpdate = require('../helpers/partialUpdate');
const sqlForPartialUpdate = require('../helpers/partialUpdate.js');
const { validateUserJSON } = require('../middleware/validation.js');

const router = new express.Router();

// Update username in query params with data in req. body
router.patch('/:username', async function(req, res, next) {
  try {
    const table = 'users';
    const id = req.params.username;
    const key = 'username';
    const items = req.body;
    const result = await User.updateUser(table, items, key, id);
    return res.json({ user: result });
  } catch (error) {
    error.status = 404;
    return next(error);
  }
});

router.delete('/:username', async function(req, res, next) {
  try {
    const username = req.params.username;
    await User.deleteUser(username);
    return res.json({ message: 'User deleted' });
  } catch (error) {
    error.status = 404;
    return next(error);
  }
});

module.exports = router;
