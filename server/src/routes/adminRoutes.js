const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Login endpoint
router.post('/login', adminController.login);

// Get logged-in admin details (protected)
router.get('/me', protect, adminController.getMe);

module.exports = router;
