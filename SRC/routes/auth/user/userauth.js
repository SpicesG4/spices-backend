'use strict';

const express = require('express');
const authRouter = express.Router();
const User = require('../../../DB/model/user.schema');
const bearerAuth = require('../../../middleware/bearer')

authRouter.post('/addtofav', bearerAuth, handleaddfav);

//Return All users
authRouter.get('/listusers', bearerAuth, async (req, res, next) => {
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

//Return All Chefs
authRouter.get('/list-chef', bearerAuth, async (req, res, next) => {
  const chefUsers = await User.find({ role: 'chef' });
  res.status(200).json(chefUsers);
});

async function handleaddfav(req, res) {
  const { userId, postId } = req.body
  const users = await User.find({});
  let arr = [];
  users.map((ele) => {
    if (userId == ele._id) {
      ele.recipesArray.map((ele1) => {
        if (postId == ele1._id) { arr.push(ele1) }
      })
    }
  })
  req.user.recipesArray = arr
  await req.user.save();
  res.status(201).json(arr);
}

module.exports = authRouter;


