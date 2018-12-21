const express = require('express');

// Class import
const User = require('../models/user');
const { validateUserJSON } = require('../middleware/validation.js');

const router = new express.Router({ mergeParams: true });

// POST new user
router.post('/', validateUserJSON, async function(req, res, next) {
  try {
    console.log('req.body is ----', req.body);
    let userData = await User.create(req.body);
    console.log(userData);
    return res.json({ users: userData });
  } catch (err) {
    err.status = 409; // conflict error - user already exists
    return next(err);
  }
});

// GET all users
router.get('/', async function(req, res, next) {
  try {
    const allUsers = await User.getAllUsers();
    return res.json({ users: allUsers });
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

// GET user by id

router.get('/:username', async function(req, res, next) {
  try {
    let userData = await User.getUser(req.params.username);
    return res.json({ user: userData });
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

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
