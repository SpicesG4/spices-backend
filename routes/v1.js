const express = require('express');
const router = express.Router();

const Users = require('../DB/model/user.schema');
const bcrypt = require('bcrypt');

const basicAuth = require('../middleware/basic-auth')

router.post('/signup', async (req, res) => {
  try {
    // console.log(req.body.password)
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = new Users(req.body);
    const record = await user.save(req.body);
    res.status(201).json(record);
  } catch (e) { res.status(403).json(e.message); }
});

router.post('/signin', basicAuth, (req, res) => {
  res.status(200).json(req.body.user);
});

module.exports = router;