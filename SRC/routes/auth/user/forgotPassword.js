const router = require("express").Router();
const User = require('../../../DB/model/user.schema');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

router.post("/forget", forget);
router.put('/api/forget/:token', verify);


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

forget = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(422).send({ message: "Missing email." });
  } try {

    const username = await User.findOne({ email });
    const verificationToken = username.generateVerificationToken();

    const url = `http://localhost:3001/api/forget/${verificationToken}`
    transporter.sendMail({
      to: email,
      subject: 'change your password',
      html: `Click <a href = '${url}'>here</a> to change your password.`
    });
    return res.status(201).send('Email sent');
  } catch (err) {
    return res.status(500).send(err);
  }
}


verify = async (req, res) => {
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
    user.password = req.body.password;
    await user.save();
    return res.status(200).send({
      message: "password changed "
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}




module.exports = router;