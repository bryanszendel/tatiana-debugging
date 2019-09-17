const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

//import express-session
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const dbConnection = require('../database/dbConfig.js');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

//session config object
const sessionConfig = {
  name: 'pizzalover', //if we don't set this the default will be sid
  secret: 'keep it secret, keep it safe', //we use this to encrypt and decrypt the cookie
  cookie: {
    maxAge: 1000 + 60, //means the cookie will be valid for 30 seconds, and will expire after that
    secure: false, //during development, this can be false. in production, should be true. true means only send cookie over https
    httpOnly: true, //this cookie cannot be accessed from Javascript. should always be true
  },
  resave: false, //if the cookie hasn't changed, it should not be recreated; keep the one that was there
  saveOnInitialized: true, //GDPR laws against setting cookies automatically. this should only be true once a user opts in to let us use cookies
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'knexsessions',
    createtable: true,
    clearInterval: 1000 + 60 + 30, //cleans out expired session data
  }), //be sure to call new, because knexsessionstore provides a constructor function
};

server.use(helmet());
server.use(express.json());
server.use(cors());

//use session as global middleware
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
