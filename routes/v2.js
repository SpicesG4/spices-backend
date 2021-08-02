const express = require('express');
const authRouter = express.Router();
const mongoose = require('mongoose');


const User = require('../DB/model/user.schema');
const basicAuth = require('../middleware/basic-auth')
const bearerAuth = require('../middleware/bearer')
const acl = require('../middleware/acl')
const aclAdmin=require('../middleware/acladmin')

//Start of chef routes
authRouter.post('/addfood', bearerAuth, acl, handleCreate);
authRouter.get('/getfood', bearerAuth, acl, handleGetData);

authRouter.put('/updatefood/:id', bearerAuth, acl, handleUpdateData);

authRouter.delete('/deletefood/:id', bearerAuth, acl, handleDeleteData);

// End of chef routes 


//start of Admin routes
authRouter.delete('/deleteUser/:username', bearerAuth, aclAdmin, handleDeleteUser)
// end of Admin routes




//Handle add element 
//Create a recioe , the response will be all recipes
async function handleCreate(req, res, next) {
    //  const { email, name, imageUrl, movie, news, books, art, cats, food } = req.body;

    const { description, date } = req.body
    console.log(req.user)
    req.user.recipesArray.unshift({ description: description, date: date })

    await req.user.save();

    res.send(req.user)
}

async function handleGetData(req, res, next) {
    //  const { email, name, imageUrl, movie, news, books, art, cats, food } = req.body;
    res.send(req.user.recipesArray)


}



async function handleUpdateData(req, res, next) {


    req.user.recipesArray.map((element) => {
        if (element._id == req.params.id) {
            element.description = req.body.description
            element.date = req.body.date


            return element
        }
    })


    await req.user.save()
    //   await  req.user.recipesArray.findByIdAndUpdate({_id:req.params.id},{ description: description, date: date })

    res.send(req.user)
}

async function handleDeleteData(req, res) {

    let results = []
    const data = req.user.recipesArray.map((element) => {
        if (element._id == req.params.id) {
            console.log("no need")
        }

        else {
            console.log("hello from else ")
            results.push(element)
            return element

        }

    })


    req.user.recipesArray = results
    console.log(results)
    await req.user.save()

    res.send(req.user)

}


//////// End of Chef's stuff
//

///start admin role

 async function handleDeleteUser(req, res) {
 
//     const id = Number(req.params.id);

    const { username } = req.params;
    User.findOneAndDelete({username: username}, 
    (err, result) => {
    if (err) return res.send(500, err)
    console.log('got deleted');
    // res.redirect('/');
    });

 }

    // let usersArr = []
    
    // const data = User.map((element) => {
    //     if (element._id == req.params.id) {
    //         console.log("no need")
    //     }
    //     else {
    //         console.log("hello from else ")
    //         usersArr.push(element)
    //         return element
    //     }

    // })


    // // req.user = users
    // console.log(usersArr)
    // // await user.save()

    // res.send(usersArr)



/// End admin role


module.exports = authRouter;