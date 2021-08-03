const express = require('express');
const authRouter = express.Router();
const mongoose = require('mongoose');

'use strict';

function acladmin(req, res, next) {

    if(req.user.role === "admin"){
        next()
    }else{
        console.log(req.user)
        console.log("else is done ")
        res.status(401).send("unauthorized")
    }
    console.log(req.user)
}


module.exports = acladmin;
