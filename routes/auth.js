const jwt = require('jsonwebtoken');
const { SECRET_KEY, BCRYPT_WORK_ROUNDS } = require('../config');
const Router = require('express').Router;

const router = new Router();

const User = require('../models/user');

router.post('/login', async function(req, res, next) {
  // Provide username and password in the body

  try {
    let { username, password } = req.body;

    let token = await User.loginGetToken(username, password);
    console.log('TOKEN ------', token);
    return res.json({ token: token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
