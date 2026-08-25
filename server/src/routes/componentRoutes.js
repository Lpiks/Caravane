const express = require('express');
const router = express.Router();
const {
  getComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent
} = require('../controllers/componentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getComponents)
  .post(protect, createComponent);

router.route('/:id')
  .get(getComponentById)
  .put(protect, updateComponent)
  .delete(protect, deleteComponent);

module.exports = router;
