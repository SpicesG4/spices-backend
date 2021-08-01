require('dotenv').config();

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
    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(409).send({
        message: "Email is already in use."
      });
    }       // Step 1 - Create and save the user
    const user = await new User({
      _id: new mongoose.Types.ObjectId,
      email: email
    }).save();       // Step 2 - Generate a verification token with the user's ID
    const verificationToken = user.generateVerificationToken();       // Step 3 - Email the user a unique verification link
    const url = `http://localhost:3000/api/verify/${verificationToken}` 
          transporter.sendMail({
      to: email,
      subject: 'Verify Account',
      html: `Click <a href = '${url}'>here</a> to confirm your email.`
    })  ;   
      return res.status(201).send({
      message: `Sent a verification email to ${email}`
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}