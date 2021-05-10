const express = require("express");
const indexController = require("../controllers/IndexController");
const postController = require("../controllers/PostController");
const middleware = require("../middleware/Auth");

var router = express.Router();

router.get("/unauthorized", indexController.unauthorized);

router.get("/posts", middleware.authenticate, postController.getPosts);

module.exports = router;
