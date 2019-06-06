const bcrypt = require('bcrypt');

const User = require('../users/users-model.js');

module.exports =  function restricted(req, res, next) {
    const { username, password} = req.headers;

    if(username && password) {
        User.findBy({ username })
        .first()
        .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) 
           {
            next();
          } else {
            res.status(401).json({ message: 'Invalid Credentials' });
          }
        })
        .catch(error => {
          res.status(500).json({message: 'You Shall Not Pass'});
        });
    } else {
        res.status(400).json({message: 'Please provide valid Credentials'});
    }
   
};