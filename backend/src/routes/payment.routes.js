const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authMiddleware } = require('../middleware/auth');

const createPaymentValidation = [
  // Валидация будет добавлена позже
];

const createTopUpValidation = [
  // Валидация будет добавлена позже
];

router.use(authMiddleware);

// Payment routes
router.post('/payment', paymentController.createPayment);
router.post('/topup', paymentController.createTopUp);
router.get('/transactions', paymentController.getTransactions);
router.get('/transactions/:id', paymentController.getTransaction);

// Webhook for YooKassa notifications
router.post('/webhook/yookassa', paymentController.paymentNotification);

module.exports = router;
