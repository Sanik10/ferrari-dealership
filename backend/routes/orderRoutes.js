const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');

// Маршруты для заказов
router.get('/my', authMiddleware, orderController.getMyOrders);
router.get('/', [authMiddleware, managerMiddleware], orderController.getAllOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.post('/', authMiddleware, orderController.createOrder);
router.put('/:id/status', [authMiddleware, managerMiddleware], orderController.updateOrderStatus);

module.exports = router;