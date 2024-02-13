const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/auth');

const postController = require('../controllers/postController');

router.get('/my-posts', postController.getAllPostsByUser);

router.get('/:id', postController.getPost);

router.post('/', postController.createPost);

router.post('/like/:id', postController.likePost);

router.post('/dislike/:id', postController.dislikePost);

router.delete('/:id', postController.deletePost);

router.get('/', postController.getPostsByPagination);

module.exports = router;