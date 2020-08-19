const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// The below expression is called object
// destructuring (Javascript feature). 
// We basically require something from
// an object by calling it by its name
// inside the brackets.
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email!'],
        unique: true, 
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email!']
    },
    password: {
        type: String, 
        required: [true, 'Please enter a password!'],
        minlength: [6, 'Minimum password length is 6 characters!']
    }
});

// Mongoose hooks:
// We use hooks to pretty much fire something
// before a certain function or event. In our case
// we are using hooks to encrypt the passwords of
// the users before storing them to the db :)

// Firing a function after a doc is saved to the db:

// userSchema.post('save', function(doc, next){
//     console.log('New user was created and saved!');
//     next();
//     // The next function should always be defined
//     // when using hooks.
// });

// Firing a function before a doc is saved to the db:

userSchema.pre('save', async function(next){
    console.log('User about to be created!', this);

    // Hashing the passwords:
    
    // We use the bcrypt library, we first generate a salt,
    // which is a string that is added to the hashed password.
    // We hash the password using the hash function. The salt string
    // is added as an extra security layer, so the hackers
    // can not reverse engineer the crypting progress.

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;