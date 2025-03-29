const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');
const vipAccessMiddleware = require('../middleware/vipAccessMiddleware');
const { eventUploader } = require('../middleware/uploadMiddleware');

// Публичные маршруты событий
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Маршруты требующие авторизации
router.post('/', [authMiddleware, managerMiddleware], eventController.createEvent);
router.put('/:id', [authMiddleware, managerMiddleware], eventController.updateEvent);
router.delete('/:id', [authMiddleware, adminMiddleware], eventController.deleteEvent);
router.put('/:id/status', [authMiddleware, managerMiddleware], eventController.updateEventStatus);
router.get('/:id/registrations', [authMiddleware, managerMiddleware], eventController.getEventRegistrations);
router.post('/:id/upload-image', [authMiddleware, managerMiddleware, eventUploader.single('image')], eventController.uploadEventImage);

// Маршруты для регистрации на события
const eventRegistrationController = require('../controllers/eventRegistrationController');

router.post('/:eventId/register', authMiddleware, eventRegistrationController.registerForEvent);
router.post('/:eventId/cancel', authMiddleware, eventRegistrationController.cancelRegistration);
router.get('/registrations/my', authMiddleware, eventRegistrationController.getMyRegistrations);
router.put('/registrations/:id/status', [authMiddleware, managerMiddleware], eventRegistrationController.updateRegistrationStatus);

// VIP события
router.get('/vip', [authMiddleware, vipAccessMiddleware], (req, res) => {
  req.query.vipOnly = 'true';
  eventController.getAllEvents(req, res);
});

module.exports = router; 