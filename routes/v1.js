'use strict';

const express = require('express');
const authRouter = express.Router();

const jwt = require("jsonwebtoken");

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
  const chefUsers = await User.find({ role: 'chef' });
  res.status(200).json(chefUsers);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});



authRouter.put("/logout", bearerAuth,UserController.logout );
//  authRouter.post('/logout', bearerAuth, async (req, res) => {
//   try {
//     let randomNumberToAppend = toString(Math.floor((Math.random() * 1000) + 1));
//     let randomIndex = Math.floor((Math.random() * 10) + 1);
//     let hashedRandomNumberToAppend = await bcrypt.hash(randomNumberToAppend, 10);
//     // now just concat the hashed random number to the end of the token
//     req.token = req.token + hashedRandomNumberToAppend;
//     return res.status(200).json('logout');
//   } catch (err) {
//     return res.status(500).json(err.message);
//   }
// });


module.exports = authRouter;