const router = require('express').Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const restricted = require('./restricted-middleware.js');

const User = require('../users/users-model.js');

//endpoints at /api/auth/(name of endpoint)

// Register User at /api/auth/register will require a username and password,  
// password will be stored as salted hash 
router.post('/register', (req, res) => {
    let user = req.body;
    if (!user.username || !user.password) {
        return res.status(500).json({message: 'Must provide username and password'});
    }

    if (user.password.length < 0) {
        return res.status(400).json({message:'Please enter a password'})
    }

    const hash = bcrypt.hashSync(user.password, 16);

    user.password = hash;

    User.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(error => {
        res.status(500).json({message: 'An error occurred trying to register. Please try again.'})
    });
});

//POST to login
// /api/auth/login
//requires valid username and password
router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    User.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) 
    {
        req.session.user = user;
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json({message: 'You Shall Not Pass'});
      });
  });

  // logsout user. clears cookie. runs restricted middleware
  router.get('/logout', restricted, (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'There was an error' });
        }
  
        res.end();
      });
    } else {
      res.end();
    }
  });

  module.exports = router;