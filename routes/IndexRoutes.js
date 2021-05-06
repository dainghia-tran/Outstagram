const express = require('express');
const UserController = require('../controllers/UserController');
const authService = require('../services/AuthService');

var router = express.Router();

/* GET home page. */
router.get('/', authService.isSignedIn, UserController.showUserInformation);


module.exports = router;
