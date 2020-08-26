const User = require('../models/User');
const jwt = require ('jsonwebtoken');

// Handle errors:

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // Incorrect email:

  if(err.message === 'The user email does not exist!'){
    errors.email = 'Please enter a registered email or sign up!'
  }

  // Incorrect password:

  if(err.message === 'The password is incorrect!'){
    errors.password = 'Password is not correct!'
  }

  // Duplicate error codes:

  if(err.code === 11000){
      errors.email = 'That email is already registred!';
      return errors;
  }

  // Validation errors:
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// Creating a token and returning it:

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({id}, 'my secret', {
    expiresIn: maxAge
  });
}


module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

// POST method for signup: 

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    
    // Passing the token to a cookie and 
    // sending the cookie back:

    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});

    res.status(201).json(user);
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
};

// POST method for login: 

module.exports.login_post = async (req, res) => {
  const {email, password} = req.body;

  try{
    const user = await User.login(email, password);
    const token = createToken(user._id);
    
    // Passing the token to a cookie and 
    // sending the cookie back:

    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
    res.status(200).json({user: user._id});
  }
  catch(err){
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
};

// GET method for logout:

module.exports.logout_get = (req, res) => {
  // We logout the user by overwriting
  // the existing jwt token with an 
  // empty token that stays in the browser
  // for only a fragment of a second:

  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/');
}
