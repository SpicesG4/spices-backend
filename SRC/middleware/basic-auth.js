'use strict';
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const User = require('../DB/model/user.schema');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ');

  let [email, pass] = base64.decode(basic[1]).split(':');

  try {
    req.user = await User.authenticateBasic(email, pass)
    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

}