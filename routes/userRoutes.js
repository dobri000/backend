const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth/auth');

const userController = require('../controllers/userController');

router.put('/', userController.updateProfileImage);

module.exports = router;