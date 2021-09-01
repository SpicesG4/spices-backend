require('dotenv').config();
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const User = require('../DB/model/user.schema');

const nodemailer = require('nodemailer'); const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});


exports.signup = async (req, res) => {
  const { email } = req.body    // Check we have an email
  if (!email) {
    return res.status(422).send({ message: "Missing email." });
  } try {
    console.log('1');
    const existingUser = await User.findOne({ email }).exec();
    
    if (existingUser) {
      console.log('token',existingUser.token)
      
    console.log('2');
      return res.status(409).send({
        message: "Email is already in use."
      });
    }
    const username = await new User(req.body);
    username.save()
    const output = {
      user: username,
      token: username.token
    };

    const verificationToken = username.generateVerificationToken();
    const url = `https://spice-g4.herokuapp.com/api/verify/${verificationToken}`;

    transporter.sendMail({
      to: email,
      subject: 'Verify Account',
      html: `Click <a href = '${url}'>here</a> to confirm your email.`
    });

    return res.status(201).send(output);
  } catch (err) {
    return res.status(500).send(err);
  }
}

exports.logout = (req, res) => {
  const authHeader = req.headers["authorization"];
  jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) { res.send({ msg: 'You have been Logged Out' }); }
    else { res.send({ msg: 'Error' }); }
  });
}


exports.login = async (req, res) => {
  const { email } = req.body    // Check we have an email
  if (!email) {
    return res.status(422).send({
      message: "Missing email."
    });
  } try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).send({
        message: "User does not exists"
      });
    }
    if (!user.verified) {
      return res.status(403).send({
        message: "Verify your Account."
      });
    } return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
}



exports.verify = async (req, res) => {
  const { token } = req.params
  if (!token) {
    return res.status(422).send({
      message: "Missing Token"
    });
  }
  let payload = null
  try {
    payload = jwt.verify(
      token,
      process.env.USER_VERIFICATION_TOKEN_SECRET
    );
  } catch (err) {
    return res.status(500).send(err);
  } try {

    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).send({
        message: "User does not  exists"
      });
    }
    user.verified = true;
    await user.save(); return res.status(200).send({
      message: "Account Verified"
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}