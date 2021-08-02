'use strict';

const users = require('../DB/model/user.schema')

module.exports = async (req, res, next) => {

  try {
    if (!req.headers.authorization){ next('Invalid Login') }
    
    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateWithToken(token);
    
    req.user = validUser;
    req.token = validUser.token;
    
    console.log(req.user)
    console.log(req.token)


    if(req.user.verified)
    console.log(req.user.verified)
    next();
  } catch (e) {
    res.status(403).send('Invalid Login');;
  }
}