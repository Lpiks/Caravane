const express = require('express');
const router = express.Router();
const studioController = require('../controllers/studioController');

// Save a new 3D design from public client
router.post('/save', studioController.saveDesign);

// Admin endpoints
// Fetch all designs
router.get('/designs', studioController.getAllDesigns);

// Fetch specific design by ID
router.get('/designs/:id', studioController.getDesignById);

// Update specific design status
router.patch('/designs/:id/status', studioController.updateDesignStatus);

module.exports = router;
