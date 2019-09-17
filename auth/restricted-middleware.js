module.exports = (req, res, next) => {
  //we are checking that we have a session (the user is logged in), and that there is a user property inside of that session
  //this only happens when we have a successful login 
  console.log('request:', req.session);
  if (req.session && req.session.user) {
    console.log('SESSION USER WAS FOUND')
    next();
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
};
