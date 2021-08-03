const User = require('../DB/model/user.schema');
const express = require('express');
const authRouter = express.Router();
const basicAuth = require('../middleware/basic-auth')
const bearerAuth = require('../middleware/bearer')
const aclAdmin=require('../middleware/acladmin')



//start of Admin routes

authRouter.delete('/deleteUser/:username', bearerAuth, aclAdmin, handleDeleteUser)


// end of Admin routes


async function handleDeleteUser(req, res) {
 
        const { username } = req.params;
        User.findOneAndDelete({username: username}, 
        (err, result) => {
        if (err) return res.send(500, err)
        console.log('got deleted');
         res.statuse(202).send('delete');
        });
     }


module.exports = authRouter;