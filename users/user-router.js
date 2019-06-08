const router = require('express').Router();

const restricted = require('../authentication/restricted-middleware.js');
const User = require('../users/users-model.js');

//if logged in get list of users
// at /api/user
router.get('/', restricted, (req, res) => {
    User.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.status(500)({message: 'You Shall Not Pass'}));
  });

  module.exports = router;