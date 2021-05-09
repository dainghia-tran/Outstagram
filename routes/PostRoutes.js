const express = require('express');
const router = express.Router();

const PostController = require('../controllers/PostController');
const middleware = require('../middleware/Auth');

router.get('/:id', PostController.getPost);

router.post('/:id/delete', middleware.isAuthenticated, PostController.deletePost);

module.exports = router;