const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// View engine
app.set('view engine', 'ejs');

//Database connection
const dbURI = 'mongodb+srv://alteocaka:alteo12345@cluster0.glqm1.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));

// The below "app.use(authRoutes)" is pretty
// much the same as the "app.get()" above.
// It just gives us the oppurtunity to structure
// the routes in another folder.
app.use(authRoutes);