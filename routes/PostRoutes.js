const express = require("express");
const router = express.Router();

const postController = require("../controllers/PostController");
const middleware = require("../middleware/Auth");

router.get('/posts', middleware.authenticate, postController.getPosts);

router.post('/create', middleware.authenticate, postController.createPost);

router.put('/:id/react', middleware.authenticate, postController.reactPost);

router.delete(
    "/:id",
    middleware.authenticate,
    postController.deletePost
);

module.exports = router;
