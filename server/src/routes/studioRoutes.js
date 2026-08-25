const express = require('express');
const router = express.Router();
const studioController = require('../controllers/studioController');
const { protect } = require('../middleware/authMiddleware');
const { validateStudioSave } = require('../middleware/validationMiddleware');

// Save a new 3D design from public client
router.post('/save', validateStudioSave, studioController.saveDesign);

// Admin endpoints
// Fetch all designs
router.get('/designs', protect, studioController.getAllDesigns);

// Fetch specific design by ID
router.get('/designs/:id', protect, studioController.getDesignById);

// Update specific design status
router.patch('/designs/:id/status', protect, studioController.updateDesignStatus);

module.exports = router;
