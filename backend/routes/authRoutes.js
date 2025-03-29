const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Аутентификация
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;