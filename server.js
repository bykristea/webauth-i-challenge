const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const session = require('express-session');

const SessionStore = require('connect-session-knex')(session);

const authRouter = require('./authentication/auth-router.js');
const usersRouter = require('./users/user-router.js');

const server = express();

const sessionConfig = {
  name: 'monkey',
  secret: 'super secret string',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false,
    httpOnly: true
  },
  store: new SessionStore({
    knex: require('./database/dbConfig.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 60 * 60 * 1000,
  }),
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

//pulls in auth router file. all endpoints will go to /api/auth/(endpointName)
server.use('/api/auth', authRouter);

// pulls in users router file. all endpoints will go to /api/users/(endpointName)
server.use('/api/users', usersRouter);

//server check to see if up and running. 
// localhost://4000/ should return message
server.get('/', (req, res) => {
    res.send("Fly you Fools!")
});

  

module.exports = server;