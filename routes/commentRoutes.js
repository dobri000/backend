const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/auth');

const commentController = require('../controllers/commentController');

router.post('/:id', commentController.addComment);

module.exports = router;