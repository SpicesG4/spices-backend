const express = require('express');
const authRouter = express.Router();

const User = require('../DB/model/user.schema');
const basicAuth = require('../middleware/basic-auth')
const bearerAuth = require('../middleware/bearer')
const acl = require('../middleware/acl')

//Start of chef routes
authRouter.post('/addfood', bearerAuth, acl, handleCreate);
authRouter.get('/getfood', bearerAuth, acl, handleGetData);

authRouter.put('/updatefood/:id', bearerAuth, acl, handleUpdateData);

authRouter.delete('/deletefood/:id', bearerAuth, acl, handleDeleteData);
// End of chef routes 

//start of Public
authRouter.get('/getallfood/', bearerAuth, handlegetAll);




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


req.user.recipesArray.map((element)=>{
    if(element._id == req.params.id)
    {
element.description=req.body.description
element.date=req.body.date


        return element
    }
})


await req.user.save()
    //   await  req.user.recipesArray.findByIdAndUpdate({_id:req.params.id},{ description: description, date: date })

    res.send(req.user)
}

async function  handleDeleteData(req, res) {

    let results=[]
    const data =  req.user.recipesArray.map((element)=>{
        if(element._id == req.params.id)
        {
         console.log("no need")
        }


        else
        {
            console.log("hello from else ")
            results.push(element)
            return element

        }
    
    })


    req.user.recipesArray=results
console.log(results)
await req.user.save()

res.send(req.user)

}


//////// End of Chef's stuff
//
async function  handlegetAll(req, res) {

}


module.exports = authRouter;