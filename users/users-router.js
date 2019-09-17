const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({ message: "There was an error logging you out." });
      } else {
        res.status(200).json({ message: "Bye!" })
      } 
    });
  } else {
    res.status(200).json({ message: "This user is already logged out." })
  }
})

module.exports = router;
