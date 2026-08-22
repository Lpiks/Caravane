const Template = require('../models/Template');

// @desc    Get all templates (optionally filtered by chassisId)
// @route   GET /api/templates
// @access  Public
const getTemplates = async (req, res) => {
  try {
    const filter = {};
    if (req.query.chassisId) {
      filter.chassisId = req.query.chassisId;
    }
    const templates = await Template.find(filter).sort({ createdAt: -1 }).lean();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Server error fetching templates' });
  }
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).lean();
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Server error fetching template' });
  }
};

// @desc    Create a new template
// @route   POST /api/templates
// @access  Private/Admin
const createTemplate = async (req, res) => {
  try {
    const { name, description, chassisId, modules, thumbnailUrl } = req.body;

    const template = new Template({
      name,
      description,
      chassisId,
      modules,
      thumbnailUrl
    });

    const createdTemplate = await template.save();
    res.status(201).json(createdTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Server error creating template' });
  }
};

// @desc    Update a template
// @route   PUT /api/templates/:id
// @access  Private/Admin
const updateTemplate = async (req, res) => {
  try {
    const { name, description, chassisId, modules, thumbnailUrl } = req.body;

    const template = await Template.findById(req.params.id);

    if (template) {
      template.name = name || template.name;
      template.description = description !== undefined ? description : template.description;
      template.chassisId = chassisId || template.chassisId;
      template.modules = modules || template.modules;
      template.thumbnailUrl = thumbnailUrl !== undefined ? thumbnailUrl : template.thumbnailUrl;

      const updatedTemplate = await template.save();
      res.json(updatedTemplate);
    } else {
      res.status(404).json({ message: 'Template not found' });
    }
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server error updating template' });
  }
};

// @desc    Delete a template
// @route   DELETE /api/templates/:id
// @access  Private/Admin
const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (template) {
      await template.deleteOne();
      res.json({ message: 'Template removed' });
    } else {
      res.status(404).json({ message: 'Template not found' });
    }
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Server error deleting template' });
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
};
