const express = require("express");
const router = express.Router();

const postController = require("../controllers/PostController");
const middleware = require("../middleware/Auth");
const { route } = require("./AccountRoutes");

//route: /p
router.get('/all', postController.getAllPosts);

//route: /p/create
router.post("/create", middleware.authenticate, postController.createPost);

//route: /p/{id}/react
router.put("/:id/react", middleware.authenticate, postController.reactPost);

//route: /p/{id}/comment
router.put("/:id/comment", middleware.authenticate, postController.commentPost);

//route: /p/{id}
router.get('/:id', postController.getPostById);

//route: /p/{id}
router.delete("/:id", middleware.authenticate, postController.deletePost);

module.exports = router;
