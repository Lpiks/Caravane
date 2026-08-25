const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

// Define routes
router.get('/', vehicleController.getVehicles);

// Admin routes
router.post('/', protect, vehicleController.createVehicle);
router.put('/:id', protect, vehicleController.updateVehicle);
router.delete('/:id', protect, vehicleController.deleteVehicle);

module.exports = router;
