const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs',);
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs',);
});

router.get('/sign-out', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// POST
router.post('/sign-up', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Check if email is already taken
    const userInDatabase = await User.findOne({ email });
    if (userInDatabase) {
        console.log(userInDatabase)
      return res.redirect('/auth/sign-up') 
    
    }
       
    // Check if passwords match
    if (password !== confirmPassword) {
        console.log(password)
      return res.redirect('/auth/sign-up');
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      savedQuotes: []
    });
console.log(newUser)
    res.redirect('/auth/sign-in');
  } catch (error) {
    console.error(error);
    res.redirect('/auth/sign-up');
  }
});

// POST: Handle Sign-In
router.post('/sign-in', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userInDatabase = await User.findOne({ email });
    if (!userInDatabase) {
      return res.redirect('/auth/sign-in');
    }

    const validPassword = bcrypt.compareSync(password, userInDatabase.password);
    if (!validPassword) {
      return res.redirect('/auth/sign-in');
    }

    // Save session
    req.session.user = {
      _id: userInDatabase._id,
      email: userInDatabase.email
    };

    res.redirect('/motivational-wall'); // Redirect to the motivational wall or dashboard
  } catch (error) {
    console.error(error);
    res.render('auth/sign-in.ejs', {
      error: 'Login failed. Please try again.'
    });
  }
});

module.exports = router;
