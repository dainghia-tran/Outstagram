const express = require("express");
const indexController = require("../controllers/IndexController");
const postController = require("../controllers/PostController");
const userController = require('../controllers/UserController');
const middleware = require("../middleware/Auth");

var router = express.Router();

router.get("/unauthorized", indexController.unauthorized);

router.get("/posts", middleware.authenticate, postController.getPosts);

router.get('/:param', userController.getUser);

router;

module.exports = router;
