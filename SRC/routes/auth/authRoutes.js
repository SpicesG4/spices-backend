'use strict';

const express = require('express');
const authRouter = express.Router();

const jwt = require("jsonwebtoken");

const basicAuth = require('../../middleware/basic-auth');
const bearerAuth = require('../../middleware/bearer');

const UserController = require('../../controllers/user_controller.js');


authRouter.post('/signup', UserController.signup);
authRouter.post('/signin', basicAuth, UserController.login);
authRouter.put('/logout', bearerAuth,UserController.logout );
authRouter.get('/api/verify/:token', UserController.verify);



module.exports = authRouter;