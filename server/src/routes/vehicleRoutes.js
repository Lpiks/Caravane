const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Define routes
router.get('/', vehicleController.getVehicles);

// Admin routes
router.post('/', vehicleController.createVehicle);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
