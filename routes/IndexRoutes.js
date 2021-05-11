const express = require("express");
const indexController = require("../controllers/IndexController");
const postController = require("../controllers/PostController");
const userController = require('../controllers/UserController');
const middleware = require("../middleware/Auth");

var router = express.Router();

//route: /unauthorized
router.get("/unauthorized", indexController.unauthorized);

//route: /posts
router.get("/posts", middleware.authenticate, postController.getPosts);

//route: /suggest
router.get('/suggest', middleware.authenticate, userController.getSuggestions);

//route: /:{id || username}
router.get('/:param', userController.getUser);

// route: /

module.exports = router;
