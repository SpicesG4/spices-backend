const express = require('express');
const publicRoute = express.Router();

const User = require('../DB/model/user.schema');
const basicAuth = require('../middleware/basic-auth')
const bearerAuth = require('../middleware/bearer')
// const acl = require('../middleware/acl')

//Start of chef routes

publicRoute.get('/getallfood', handlegetAll);

publicRoute.get('/getallfood/:id', handlegetAll);
publicRoute.post('/addtofav', bearerAuth, handleaddfav);

// End of chef routes 

//start of Public

async function handlegetAll(req, res) {
  id = req.params.id

  console.log("llll", req.user);
  const users = await User.find({});
  console.log(users);
  let arr = [];


  if (id) {
    console.log("first", id);
    users.map((ele) => {

      if (id == ele._id) { arr.push(ele.recipesArray); console.log(id); }

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

async function handleaddfav(req, res) {
  const { userId, postId } = req.body

  console.log("reqbody", req.body);
  const users = await User.find({});
  let arr = [];
  users.map((ele) => {
    console.log("bbbbb", ele._id);
    if (userId == ele._id) {
      console.log("ggggggg");
      ele.recipesArray.map((ele1) => {
        if (postId == ele1._id) { arr.push(ele1); console.log(ele1); }

      })
    }

  })
  req.user.recipesArray = arr
  await req.user.save();
  res.status(200).json(arr);
}


module.exports = publicRoute;