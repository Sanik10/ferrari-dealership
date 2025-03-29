const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');

// Маршруты для пользователей
router.get('/profile', authMiddleware, userController.getCurrentUser);
router.get('/', [authMiddleware, adminMiddleware], userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', [authMiddleware, adminMiddleware], userController.deleteUser);
router.post('/:id/toggle-vip', [authMiddleware, managerMiddleware], userController.toggleVipStatus);
router.get('/:id/orders', authMiddleware, userController.getUserOrderHistory);
router.post('/preferences', authMiddleware, userController.addCarPreference);
router.delete('/preferences', authMiddleware, userController.removeCarPreference);

module.exports = router;