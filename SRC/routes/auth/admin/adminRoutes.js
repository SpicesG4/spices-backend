const express = require('express');
const authRouter = express.Router();
const User = require('../../../DB/model/user.schema');
const Ricipes = require('../../../DB/model/recipes.schema');
const bearerAuth = require('../../../middleware/bearer');
const aclAdmin = require('../../../middleware/acladmin');
//Admin privilages

//start of Admin routes
authRouter.delete('/deleteUser/:id', bearerAuth,  handleDeleteUser);
authRouter.delete('/deleteContent/:id', bearerAuth,  handleDeleteContent);




// end of Admin routes


async function handleDeleteUser(req, res) {

  if (req.body.userId === req.params.id || req.user.role === "admin") {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }

}




async function handleDeleteContent(req, res) {
  try {
    const data = await Ricipes.findById(req.params.id);
    if (data.userId === req.body.userId || req.user.role === "admin") {
      await data.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
  
}


module.exports = authRouter;