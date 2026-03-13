const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const listingController = require('../controllers/listing.controller');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation rules
const createListingValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 255 }).withMessage('Title must be between 5 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be less than 5000 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('propertyType')
    .notEmpty().withMessage('Property type is required')
    .isIn(['apartment', 'house', 'land']).withMessage('Invalid property type'),
  body('dealType')
    .notEmpty().withMessage('Deal type is required')
    .isIn(['rent', 'sale']).withMessage('Invalid deal type'),
  body('rooms')
    .optional()
    .isInt({ min: 0, max: 10 }).withMessage('Rooms must be between 0 and 10'),
  body('area')
    .notEmpty().withMessage('Area is required')
    .isFloat({ min: 0 }).withMessage('Area must be a positive number'),
  body('floor')
    .optional()
    .isInt({ min: 0 }).withMessage('Floor must be a positive number'),
  body('totalFloors')
    .optional()
    .isInt({ min: 1 }).withMessage('Total floors must be a positive number'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 }),
  body('districtId')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid district ID'),
  body('lat')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('lng')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('hasFurniture')
    .optional()
    .isBoolean(),
  body('hasParking')
    .optional()
    .isBoolean(),
  body('hasElevator')
    .optional()
    .isBoolean(),
  body('hasBalcony')
    .optional()
    .isBoolean(),
  body('isNewBuilding')
    .optional()
    .isBoolean(),
  body('petsAllowed')
    .optional()
    .isBoolean(),
];

// Public routes
router.get('/', optionalAuth, listingController.getListings);
router.get('/:id', optionalAuth, listingController.getListingById);

// Protected routes
router.post('/', authMiddleware, upload.array('photos', 20), createListingValidation, listingController.createListing);
router.put('/:id', authMiddleware, upload.array('photos', 20), listingController.updateListing);
router.delete('/:id', authMiddleware, listingController.deleteListing);

// Favorites
router.post('/:id/favorite', authMiddleware, listingController.toggleFavorite);
router.get('/favorites', authMiddleware, listingController.getFavorites);

// User listings
router.get('/user/:userId', listingController.getUserListings);
router.get('/my', authMiddleware, listingController.getUserListings);

module.exports = router;
