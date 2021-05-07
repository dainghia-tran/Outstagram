const express = require('express');
const UserController = require('../controllers/UserController');
const IndexController = require('../controllers/IndexController');
const authService = require('../services/AuthService');

var router = express.Router();

/* GET home page. */
router.get('/', UserController.showUserInformation);

router.get('/unauthorized', IndexController.unauthorized);


module.exports = router;
