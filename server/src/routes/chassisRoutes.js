const express = require('express');
const router = express.Router();
const {
  getChassis,
  getChassisById,
  createChassis,
  updateChassis,
  deleteChassis
} = require('../controllers/chassisController');

router.route('/')
  .get(getChassis)
  .post(createChassis);

router.route('/:id')
  .get(getChassisById)
  .put(updateChassis)
  .delete(deleteChassis);

module.exports = router;
