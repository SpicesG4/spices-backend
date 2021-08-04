const User = require('../DB/model/user.schema');
const express = require('express');
const authRouter = express.Router();
const basicAuth = require('../middleware/basic-auth')
const bearerAuth = require('../middleware/bearer')
const aclAdmin = require('../middleware/acladmin')



//start of Admin routes

authRouter.delete('/deleteUser/:username', bearerAuth, aclAdmin, handleDeleteUser)
authRouter.delete('/deleteContent/:id/:ricepId', bearerAuth, aclAdmin, handleDeleteContent)


// end of Admin routes


async function handleDeleteUser(req, res) {

        const { username } = req.params;
        User.findOneAndDelete({ username: username },
                (err, result) => {
                        if (err) return res.send(500, err)
                        console.log('got deleted');
                        res.statuse(202).send('delete');
                });
}


async function handleDeleteContent(req, res) {
        console.log(req.params, "user, recipe")
       
        let data = await User.findById({ _id: req.params.id })
        let array = [];
        data.recipesArray.map((ele) => {
                if (ele._id == req.params.ricepId) {
                        console.log("no need")
                        return 
                }
                else {
                        array.push(ele)
                        return
                }})
               
        data.recipesArray=array 
        data.save();    
        res.status(202).send("deleted")
}
module.exports = authRouter;