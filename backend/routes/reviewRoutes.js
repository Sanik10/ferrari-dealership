const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');
const reviewController = require('../controllers/reviewController');

// Маршруты отзывов
router.get('/', reviewController.getReviews);
router.get('/my', authMiddleware, reviewController.getMyReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/', authMiddleware, reviewController.createReview);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);
router.put('/:id/approve', [authMiddleware, managerMiddleware], reviewController.approveReview);
router.put('/:id/reject', [authMiddleware, managerMiddleware], reviewController.rejectReview);

module.exports = router; 