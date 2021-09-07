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


//Update proffile picture/Cover Picture  
authRouter.put('/updateUser/:id', async (req, res) => {
  const id = req.params.id;
  const {coverPicture,profilePicture} = req.body;
  await User.find({ _id: id }, (error, data) => {
    if (error) {
      res.send(error);
    }
    else {
      data[0].profilePicture = profilePicture;
      data[0].coverPicture = coverPicture;
      data[0].save();
      res.send(data)
    }
  })
});

module.exports = authRouter;
