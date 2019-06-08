const bcrypt = require('bcrypt');

const Users = require('../users/users-model.js');

//checks the session to see if user is logged in. If logged in will run the next function. If not will return you are not authorized. 
module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'You are not authorized' });
  }
};