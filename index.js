const express=require('express')
require('./DB/mangoose')
require('dotenv').config()
const  port=process.env.PORT

const app=express()
app.use(express.json())

//Routes
const v1Routes = require('./routes/v1.js');


//Example
app.use('/', v1Routes);





app.listen(port,()=>{
    console.log('server is on port '+ port);
})
