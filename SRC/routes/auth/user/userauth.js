'use strict';

const express = require('express');
const authRouter = express.Router();
const User = require('../../../DB/model/user.schema');
const bearerAuth = require('../../../middleware/bearer')
const Recipe = require('../../../DB/model/recipes.schema')

authRouter.post('/addtofav/:id', bearerAuth, handleaddfav);

//Return All users
authRouter.get('/listusers', bearerAuth, async (req, res, next) => {
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(users);
});


//get a user
authRouter.get("/users", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Return All Chefs
authRouter.get('/list-chef', bearerAuth, async (req, res, next) => {
  const chefUsers = await User.find({ role: 'chef' });
  res.status(200).json(chefUsers);
});




async function handleaddfav(req, res) {
  
    try {
      const recipe = await Recipe.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      console.log(recipe._id)
      console.log(!currentUser.favorite.includes(recipe))
  
      if (!currentUser.favorite.includes(recipe._id)) {
        await currentUser.updateOne({ $push: { favorite: recipe._id } });
    console.log(currentUser)
        res.status(200).json("user has been added this recipy ");
      } else {
        res.status(403).json("you allready added this recipy");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  
}

module.exports = authRouter;


