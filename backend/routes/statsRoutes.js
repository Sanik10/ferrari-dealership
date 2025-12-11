const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');

// Получение статистики (только для админов и менеджеров)
router.get('/', [authMiddleware, managerMiddleware], getStats);

module.exports = router; 