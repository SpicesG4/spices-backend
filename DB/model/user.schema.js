'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const base64 = require('base-64');


const recipes = new mongoose.Schema({

  description: { type: String, default: 'test1' },
  date: { type: String, default: 'test1' },

})


const users = new mongoose.Schema({

  email: String,
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  username: { type: String,  unique: true },
  password: { type: String},
  role: { type: String,  enum: ['user', 'chef','admin'] },

  recipesArray: [recipes]


});



// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!
users.virtual('token').get(function () {
  let tokenObject = {
    username: this.username,
  }
  return jwt.sign(tokenObject, base64.encode(process.env.SECRET))
});


users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.methods.generateVerificationToken = function () {
  const user = this;    
  console.log('thisuser id',user._id);
  const verificationToken = jwt.sign(
      { ID: user._id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      { expiresIn: "7d" }
  );  
    return verificationToken;
};

// BASIC AUTH
users.statics.authenticateBasic = async function (username, password) {
  //console.log('hs')

  const user = await this.findOne({ username })
  const valid = await bcrypt.compare(password, user.password)
  if (valid) { return user; }
  throw new Error('Invalid User');
}

// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  //console.log('dshgdsgssjhs')
  try {
    const parsedToken = jwt.verify(token, base64.encode(process.env.SECRET));
    //console.log(parsedToken)
    const user = this.findOne({ username: parsedToken.username })
    // console.log('userr',user)
    if (user) { return user; }
    throw new Error("User Not Found");
  } catch (e) {
    throw new Error(e.message)
  }
}


module.exports = mongoose.model('users', users);
