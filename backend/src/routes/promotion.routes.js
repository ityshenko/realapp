const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const promotionController = require('../controllers/promotion.controller');
const paymentController = require('../controllers/payment.controller');
const { authMiddleware } = require('../middleware/auth');

const createPromotionValidation = [
  body('listingId')
    .notEmpty().withMessage('Listing ID is required')
    .isUUID().withMessage('Invalid listing ID'),
  body('type')
    .notEmpty().withMessage('Promotion type is required')
    .isIn(['boost', 'highlight', 'top', 'recommended']).withMessage('Invalid promotion type'),
  body('durationDays')
    .optional()
    .isInt({ min: 1, max: 30 }).withMessage('Duration must be between 1 and 30 days'),
];

const createPaymentValidation = [
  body('promotionId')
    .notEmpty().withMessage('Promotion ID is required')
    .isUUID().withMessage('Invalid promotion ID'),
  body('method')
    .optional()
    .isIn(['bank_card', 'yookassa', 'sbp']).withMessage('Invalid payment method'),
];

const createTopUpValidation = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 100 }).withMessage('Minimum amount is 100 RUB'),
  body('method')
    .optional()
    .isIn(['bank_card', 'yookassa', 'sbp']).withMessage('Invalid payment method'),
];

router.get('/available', promotionController.getAvailablePromotions);

router.use(authMiddleware);

router.post('/', createPromotionValidation, promotionController.createPromotion);
router.get('/my', promotionController.getUserPromotions);
router.get('/stats', promotionController.getPromotionStats);
router.post('/:promotionId/activate', promotionController.activatePromotion);

// Payment routes
router.post('/payment', createPaymentValidation, paymentController.createPayment);
router.post('/topup', createTopUpValidation, paymentController.createTopUp);
router.get('/transactions', paymentController.getTransactions);
router.get('/transactions/:id', paymentController.getTransaction);

// Webhook for YooKassa notifications
router.post('/webhook/yookassa', paymentController.paymentNotification);

module.exports = router;
