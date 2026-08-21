const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

// Define routes
router.post('/', inquiryController.createInquiry);

module.exports = router;
