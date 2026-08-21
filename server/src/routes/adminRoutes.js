const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { sensitiveLimiter } = require('../middleware/rateLimiter');

// Login endpoint (secured with rate limiting)
router.post('/login', sensitiveLimiter, adminController.login);

// Get logged-in admin details (protected)
router.get('/me', protect, adminController.getMe);

module.exports = router;
