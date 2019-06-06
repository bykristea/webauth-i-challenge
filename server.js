const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');


const db = require('./database/dbConfig.js');
const users = require('./users/users-model.js');

const server = express();


server.use(helmet());
server.use(express.json());
server.use(cors());

//server check to see if up and running. 
// localhost://4000/ should return message
server.get('/', (req, res) => {
    res.send("Fly you Fools!")
});

module.exports = server;