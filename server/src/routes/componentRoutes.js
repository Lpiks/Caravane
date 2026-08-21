const express = require('express');
const router = express.Router();
const {
  getComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent
} = require('../controllers/componentController');

router.route('/')
  .get(getComponents)
  .post(createComponent);

router.route('/:id')
  .get(getComponentById)
  .put(updateComponent)
  .delete(deleteComponent);

module.exports = router;
