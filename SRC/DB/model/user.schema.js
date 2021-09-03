'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const base64 = require('base-64');
require('dotenv').config();



const users = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: "",
  },
  followers: {
    type: Array,
    default: [],
  },
  followings: {
    type: Array,
    default: [],
  },
  favorite: {
    type: Array,
    default: [],
  },
  role: {
    type: String,
    enum: ['user', 'chef', 'admin'],
  },
  desc: {
    type: String,
    max: 50,
  },
  city: {
    type: String,
    max: 50,
  },
},
  { timestamps: true }

);




// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!

users.virtual('token').get(function () {
  let tokenObject = {
    username :this
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
  const verificationToken = jwt.sign({ ID: user._id }, process.env.USER_VERIFICATION_TOKEN_SECRET, { expiresIn: "7d" });
  return verificationToken;
};

// BASIC AUTH
users.statics.authenticateBasic = async function (email, password) {

  const user = await this.findOne({ email })
  console.log(email,user)
  const valid = await bcrypt.compare(password, user.password)
  console.log(user,"Basic")
  if (valid) { return user; }
  throw new Error('Invalid User');
}

// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, base64.encode(process.env.SECRET));
    console.log("parsed",parsedToken.username.username)
    const user222 = await this.findOne({ username: parsedToken.username.username })
console.log("User222",user222)

    if (user222) { return user222; }
    throw new Error("User Not Found");
  } catch (e) {
    throw new Error(e.message)
  }
}


module.exports = mongoose.model('users', users);
