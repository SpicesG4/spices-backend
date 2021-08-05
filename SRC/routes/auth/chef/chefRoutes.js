const express = require('express');
const authRouter = express.Router();

const bearerAuth = require('../../../middleware/bearer')
const acl = require('../../../middleware/acl')

//Start of chef routes
authRouter.post('/addfood', bearerAuth, acl, handleCreate);
authRouter.get('/getfood', bearerAuth, acl, handleGetData);
authRouter.put('/updatefood/:id', bearerAuth, acl, handleUpdateData);
authRouter.delete('/deletefood/:id', bearerAuth, acl, handleDeleteData);
// End of chef routes

//Req.user is this user
//Create a recipe , the response will be all recipes
async function handleCreate(req, res, next) {
    const { description, date } = req.body
    req.user.recipesArray.unshift({ description: description, date: date })
    await req.user.save();
    res.status(201).send(req.user)
}

//Return all recipes for a chef
async function handleGetData(req, res, next) {
    res.send(req.user.recipesArray)
}

//update Recipe
async function handleUpdateData(req, res, next) {
    req.user.recipesArray.map((element) => {
        if (element._id == req.params.id) {
            element.description = req.body.description
            element.date = req.body.date
            return element
        }
    })
    await req.user.save()
    res.send(req.user)
}

//Delete  Recipe
async function handleDeleteData(req, res) {
 let results = []
 const data = req.user.recipesArray.map((element) => {

    if (element._id != req.params.id) {
        results.push(element)
        return element
    }

  })
    req.user.recipesArray = results
    await req.user.save()
    res.send(req.user)
}

module.exports = authRouter;