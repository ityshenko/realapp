const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth');

const createReviewValidation = [
  body('revieweeId')
    .notEmpty().withMessage('User ID is required')
    .isUUID().withMessage('Invalid user ID'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters'),
  body('listingId')
    .optional()
    .isUUID().withMessage('Invalid listing ID'),
];

router.get('/:id', userController.getUserById);
router.get('/:id/reviews', userController.getUserReviews);
router.post('/reviews', authMiddleware, createReviewValidation, userController.createReview);

module.exports = router;
