const express = require('express');
const publicRoute = express.Router();

const User = require('../../DB/model/user.schema');

//Start of chef routes
publicRoute.get('/getallfood', handlegetAll);
publicRoute.get('/getallfood/:id', handlegetAll);

// End of chef routes
//Start of Public
async function handlegetAll(req, res) {
  id = req.params.id

  console.log("llll", req.user);
  const users = await User.find({});
  console.log(users);
  let arr = [];

  if (id) {
    console.log("first", id);
    users.map((ele) => {

      if (id == ele._id) {
        arr.push(ele.recipesArray);
      }

    })
  } else {
    users.map((ele) => {
      if (ele.role === 'chef' && ele.recipesArray.length >= 1) {
        arr.push(ele.recipesArray);
      }

    })
  }
  res.status(200).json(arr);
}




module.exports = publicRoute;