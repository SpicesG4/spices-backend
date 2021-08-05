'use strict';

function acl(req, res, next) {

    if (req.user.role === "user" || req.user.role === "admin" ) {
        next()
    }
    else {
        res.status(401).send("unauthorized")
    }

}

module.exports = acl;
