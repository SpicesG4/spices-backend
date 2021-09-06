const express = require('express');
const authRouter = express.Router();

const bearerAuth = require('../../../middleware/bearer');
const acl = require('../../../middleware/acl');
const Ricipes = require('../../../DB/model/recipes.schema');
const User = require('../../../DB/model/user.schema');

//Start of chef routes
authRouter.post('/addfood', bearerAuth, acl, handleCreate);
// authRouter.get('/getfood', bearerAuth, handleGetData);
authRouter.put('/updatefood/:id', bearerAuth, acl, handleUpdateData);
authRouter.delete('/deletefood/:id', bearerAuth, acl, handleDeleteData);
authRouter.put('/like/:id', bearerAuth, handleLike);
authRouter.put('/follow/:id' , handleFollow);
authRouter.put('/unfollow/:id', handleUnfollow);
authRouter.get('/getFriends/:id', handleUnGetFriends);

// End of chef routes


async function handleCreate(req, res, next) {
    const newRicipes = new Ricipes(req.body);
    try {
      const savedRicipes = await newRicipes.save();
      res.status(200).json(savedRicipes);
    } catch (err) {
      res.status(500).json(err);
    }
}


// //Return all recipes for a chef
// async function handleGetData(req, res, next) {
//     res.send(req.user.recipesArray)
// }


async function handleUpdateData(req, res) {
    try {
        const ricipe = await Ricipes.findById(req.params.id);
        if (ricipe.userId === req.body.userId) {
          await ricipe.updateOne({ $set: req.body });
          res.status(200).json("the ricipe has been updated");
        } else {
          res.status(403).json("you can update only your ricipe");
        }
      } catch (err) {
        res.status(500).json(err);
      }
}

//Delete  Recipe


async function handleDeleteData(req, res) {
  console.log(req.body)
    try {
        const ricipe = await Ricipes.findById(req.params.id);
        if (ricipe.userId == req.body.userId) {
          await ricipe.deleteOne();
          res.status(200).json(ricipe);
        } else {
          console.log(req.body)
          res.status(403).json("you can delete only your ricipe");
        }
      } catch (err) {
        res.status(500).json(err);
      }
}


// like recipes

async function handleLike(req, res) {
  try {
    const ricipe = await Ricipes.findById(req.params.id);
    if (!ricipe.likes.includes(req.body.userId)) {
      await ricipe.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The recipe has been liked");
    } else {
      await ricipe.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The recipe has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
}


// follow cheffes 

async function handleFollow(req, res) {
  // userId for the person who send the request
  // params.id for who I want to follow
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json(currentUser.followings);
        
        
      } else {
        res.status(403).json(currentUser.followings);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
  
}

// unfollow cheffes 

async function handleUnfollow(req, res) {
  // userId for the person who send the request
  // params.id for who I want to follow
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json(currentUser.followings);
      } else {
        res.status(403).json(currentUser.followings);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("you cant unfollow yourself");
  }
  
}

async function handleUnGetFriends (req, res) {
  try {


    const user = await User.findById(req.params.id);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    console.log(req.params)
    res.status(500).json(err);
  }
};

module.exports = authRouter;