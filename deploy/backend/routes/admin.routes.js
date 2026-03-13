const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, authorize } = require('../middleware/auth');

const toggleUserBlockValidation = [
  body('isBlocked')
    .notEmpty()
    .isBoolean()
    .withMessage('isBlocked must be a boolean'),
];

const updateListingStatusValidation = [
  body('status')
    .notEmpty()
    .isIn(['active', 'inactive', 'moderation', 'blocked', 'sold', 'rented'])
    .withMessage('Invalid status'),
];

// All routes require admin authentication
router.use(authMiddleware);
router.use(authorize('admin'));

// Users
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/block', toggleUserBlockValidation, adminController.toggleUserBlock);

// Listings
router.get('/listings', adminController.getAllListings);
router.put('/listings/:id/status', updateListingStatusValidation, adminController.updateListingStatus);
router.delete('/listings/:id', adminController.deleteListing);

// Statistics
router.get('/stats', adminController.getPlatformStats);
router.get('/activity', adminController.getRecentActivity);

module.exports = router;
