const express=require('express')
require('./DB/mangoose')
require('dotenv').config()
const cors = require('cors');
const morgan = require('morgan');

const  port=process.env.PORT

const app=express()

app.use(cors());
app.use(morgan('dev'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


//Routes
const v1Routes = require('./routes/v1.js');


//Example
app.use('/', v1Routes);





app.listen(port,()=>{
    console.log('server is on port '+ port);
})