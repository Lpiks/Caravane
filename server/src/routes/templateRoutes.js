const express = require('express');
const router = express.Router();
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');

// For now these are all public or rely on simple middleware if auth is added later
router.route('/')
  .get(getTemplates)
  .post(protect, createTemplate);

router.route('/:id')
  .get(getTemplateById)
  .put(protect, updateTemplate)
  .delete(protect, deleteTemplate);

module.exports = router;
