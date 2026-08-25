const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');
const { validateInquiry } = require('../middleware/validationMiddleware');

// Define routes
// Public route for customers submitting forms
router.post('/', validateInquiry, inquiryController.createInquiry);

// Protected routes for admin dashboard
router.get('/', protect, inquiryController.getInquiries);
router.delete('/:id', protect, inquiryController.deleteInquiry);

module.exports = router;
