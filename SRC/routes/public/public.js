const express = require('express');
const publicRoute = express.Router();

const User = require('../../DB/model/user.schema');
const Recipe = require('../../DB/model/recipes.schema');
const bearerAuth = require('../../middleware/bearer');

//Start of chef routes
publicRoute.get('/getallfood',bearerAuth, handlegetAll);
publicRoute.get('/getfood/:id',bearerAuth, handlegetRecipe);

// End of chef routes



async function handlegetAll(req, res) {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userRecipe = await Recipe.find({ userId: currentUser._id });
    const chefRecipe = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Recipe.find({ userId: friendId });
      })
    );
    res.json(userRecipe.concat(...chefRecipe))
  } catch (err) {
    res.status(500).json(err);
  }
}

async function handlegetRecipe(req, res) {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json(err);
  }
}




module.exports = publicRoute;