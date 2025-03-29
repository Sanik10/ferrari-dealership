const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');

// Публичные маршруты
router.post('/', contactController.createContact);

// Маршруты требующие авторизации
router.get('/', [authMiddleware, managerMiddleware], contactController.getAllContacts);
router.get('/:id', [authMiddleware, managerMiddleware], contactController.getContactById);
router.put('/:id/status', [authMiddleware, managerMiddleware], contactController.updateContactStatus);
router.post('/:id/respond', [authMiddleware, managerMiddleware], contactController.respondToContact);

module.exports = router; 