const express = require('express');
const router = express.Router();
const serviceAppointmentController = require('../controllers/serviceAppointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');

// Маршруты для сервисного обслуживания
router.get('/my', authMiddleware, serviceAppointmentController.getMyAppointments);
router.get('/', [authMiddleware, managerMiddleware], serviceAppointmentController.getAllAppointments);
router.get('/:id', authMiddleware, serviceAppointmentController.getAppointmentById);
router.post('/', authMiddleware, serviceAppointmentController.createAppointment);
router.put('/:id/status', [authMiddleware, managerMiddleware], serviceAppointmentController.updateAppointmentStatus);
router.put('/:id/parts', [authMiddleware, managerMiddleware], serviceAppointmentController.updatePartsReplaced);

module.exports = router; 