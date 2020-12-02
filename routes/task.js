'user strict'

let express = require('express');
let TaskController = require('../controllers/task');
let router = express.Router();
let md_auth = require('../middlewares/authenticated');

router.post('/task',md_auth.authenticated, TaskController.save);
router.get('/user-tasks/:user/:page?', TaskController.getTasksByUser);
router.get('/task/:id', TaskController.getTask);
router.put('/task/:id', md_auth.authenticated, TaskController.update);
router.delete('/task/:id', md_auth.authenticated, TaskController.delete)
router.get('/search/:user/:search?', TaskController.search);

module.exports = router;
