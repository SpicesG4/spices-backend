const express = require('express');
const publicRoute = express.Router();

const User = require('../../DB/model/user.schema');
const Recipe = require('../../DB/model/recipes.schema');
const bearerAuth = require('../../middleware/bearer');

//Start of chef routes
publicRoute.get('/getallfood/:userId', handlegetAll);
publicRoute.get('/getfood/:id', handlegetRecipe);

// End of chef routes



async function handlegetAll(req, res) {
  try {
    let currentUser = await User.findById(req.params.userId);
    let userRecipe = await Recipe.find({ userId: currentUser._id });

    userRecipe = userRecipe.map(r => {
      let x = JSON.stringify(r)
      x = JSON.parse(x)
      x.profilePicture = currentUser.profilePicture
      x.username = currentUser.username
      x.followings = currentUser.followings
      x.followers = currentUser.followers
      x.coverPicture = currentUser.coverPicture
      return x
    })


    let chefRecipe = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Recipe.find({ userId: friendId });
      })
    );
    const test = []
    await Promise.all(chefRecipe.map(async (recipe) => {
      if (recipe.length == 0) return {}

      const user = await User.findById(recipe[0].userId)
      // console.log(111,user)
      if (user) {

        recipe.forEach(r => {
          // console.log(user)
          let x = JSON.stringify(r)
          x = JSON.parse(x)

          x.profilePicture = user.profilePicture
          x.username = user.username
          x.followings = user.followings
          x.followers = user.followers
          x.coverPicture = user.coverPicture
          test.push(x)
        })
      }

      // if (x) {
      // }
    }));
    res.json(userRecipe.concat(...test))

  } catch (err) {
    // console.log(err.message)
    // res.status(500).json(err);
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

//get the user posts (profile page) 
publicRoute.get("/profile/:username", async (req, res) => {

  try {
    const user = await User.findOne({ username: req.params.username })
    const recipe = await Recipe.find({ userId: user._id });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json(err)
  }
});



module.exports = publicRoute;