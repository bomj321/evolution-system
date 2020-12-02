'use strict'

//Requires
let express = require('express');
let bodyParser = require('body-parser');

//Execute express

let app = express();

//Load route's files
let user_routes = require('./routes/user');
let task_routes = require('./routes/task');
//let comment_routes = require('./routes/comment');
let cors = require('cors')


//Middlewares

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
app.use(cors())


//Rewrite Routes
app.use('/api', user_routes)
app.use('/api', task_routes)
//app.use('/api', comment_routes)

//Export Module
module.exports = app;