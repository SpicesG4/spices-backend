const express=require('express')
require('./DB/mangoose')
require('dotenv').config()
const  port=process.env.PORT

//Routes
// const v1Routes = require('./routes/v1.js');


//Example
// app.use('/api/v1', v1Routes);




const app=express()

app.use(express.json())



app.listen(port,()=>{
    console.log('server is on port '+ port);
})