'use strict';


function acladmin(req, res, next) {

    if(req.user.role === "admin" ){
        next()
    }else{
        res.status(401).send("unauthorized")
    }
}


module.exports = acladmin;
