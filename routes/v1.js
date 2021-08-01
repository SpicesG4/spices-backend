'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('../DB/model/user.schema');
const basicAuth = require('../middleware/basic-auth');
const bearerAuth = require('../middleware/bearer');

const UserController = require('../controllers/user_controller.js');


authRouter.post('/signup', UserController.signup);

authRouter.post('/signin', basicAuth, UserController.login);
authRouter.get('/api/verify/:token', UserController.verify);

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});
authRouter.get('/chef', bearerAuth, async (req, res, next) => {
  const chefUsers = await User.find({role:'chef'});
  res.status(200).json(chefUsers);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;