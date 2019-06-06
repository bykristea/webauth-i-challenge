const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');


const restricted = require('./authentication/restricted-middleware.js');

const db = require('./database/dbConfig.js');
const User = require('./users/users-model.js');

const server = express();


server.use(helmet());
server.use(express.json());
server.use(cors());

//server check to see if up and running. 
// localhost://4000/ should return message
server.get('/', (req, res) => {
    res.send("Fly you Fools!")
});

// Register User at /api/register will require a username and password,  
// password will be stored as salted hash 
server.post('/api/register', (req, res) => {
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
// /api/login
//requires valid username and password
server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    User.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) 
    {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json({message: 'You Shall Not Pass'});
      });
  });
  
//if logged in get list of usersf
  server.get('/api/users', restricted, (req, res) => {
    User.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
module.exports = server;