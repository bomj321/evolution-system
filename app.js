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


//Middlewares

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Rewrite Routes
app.use('/api', user_routes)
app.use('/api', task_routes)
//app.use('/api', comment_routes)

//Export Module
module.exports = app;