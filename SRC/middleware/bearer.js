'use strict';

const users = require('../DB/model/user.schema')

module.exports = async (req, res, next) => {
  try {

    // console.log(req.headers)
    if (!req.headers.authorization){ next('Invalid Login bearrrer') }   
    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateWithToken(token);
    
    req.user = validUser;
    req.token = validUser.token;

    if(req.user.verified) next()   

  } catch (e) {
    res.status(403).send('Invalid Login from bearer');;
  }
}