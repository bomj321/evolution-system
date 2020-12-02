'user strict'

let express = require('express');
let UserController = require('../controllers/user');
let router = express.Router();

//Users routes
router.post('/register', UserController.save)
router.post('/login', UserController.login)
//router.put('/update', md_auth.authenticated, UserController.update)

module.exports = router;
