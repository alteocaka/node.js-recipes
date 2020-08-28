const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// Another middleware to check if 
// there's a valid user or not:

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        // Method from jwt package to verify token:
        jwt.verify(token, 'my secret', async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                // The .locals method allows us to grab a variable
                // like the user in our case, and make it available
                // to use in the views.
                res.locals.user = user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };