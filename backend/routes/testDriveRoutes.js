const express = require('express');
const router = express.Router();
const testDriveController = require('../controllers/testDriveController');
const authMiddleware = require('../middleware/authMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');

// Test Drive routes
router.get('/', [authMiddleware, managerMiddleware], testDriveController.getAllTestDrives);
router.get('/my', authMiddleware, testDriveController.getMyTestDrives);
router.get('/available-times', testDriveController.getAvailableTimeSlots);
router.get('/:id', authMiddleware, testDriveController.getTestDriveById);
router.post('/', authMiddleware, testDriveController.createTestDrive);
router.put('/:id/status', [authMiddleware, managerMiddleware], testDriveController.updateTestDriveStatus);

module.exports = router; 