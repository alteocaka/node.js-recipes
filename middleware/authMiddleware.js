const express = require('express');
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {

    // Get token from the request:
    const token = req.cookies.jwt

    // Check to see if the token exists 
    // and is valid:

    if(token){
        // Method from jwt package to verify token:
        jwt.verify(token, 'my secret', (err, decodedToken) => {
            if(err){
                res.redirect('/login');
                console.log(err.message);
            }
            else{
                console.log(decodedToken);
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
}

module.exports = { requireAuth };