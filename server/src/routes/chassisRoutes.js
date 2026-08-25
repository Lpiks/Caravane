const express = require('express');
const router = express.Router();
const {
  getChassis,
  getChassisById,
  createChassis,
  updateChassis,
  deleteChassis
} = require('../controllers/chassisController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getChassis)
  .post(protect, createChassis);

router.route('/:id')
  .get(getChassisById)
  .put(protect, updateChassis)
  .delete(protect, deleteChassis);

module.exports = router;
