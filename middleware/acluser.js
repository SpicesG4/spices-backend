'use strict';

function acl(req, res, next) {


    if (req.user.role === "user") {
        next()
    }
    else {

        console.log(req.user)
        console.log("else is done")
        res.status(401).send("unauthorized")
    }
    // console.log(req.user)

}

module.exports = acl;
