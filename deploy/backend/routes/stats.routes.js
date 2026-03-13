const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/dashboard', statsController.getDashboardStats);
router.get('/listing/:id', statsController.getListingStats);

module.exports = router;
