const StudioDesign = require('../models/StudioDesign');

// @desc    Save a new 3D design from client
// @route   POST /api/studio/save
exports.saveDesign = async (req, res) => {
  try {
    const { clientInfo, baseVehicle, configurationData, message } = req.body;

    if (!clientInfo || !clientInfo.name || !clientInfo.email || !clientInfo.phone) {
      return res.status(400).json({ message: 'Client information (name, email, phone) is required' });
    }
    
    if (!baseVehicle || !configurationData) {
      return res.status(400).json({ message: 'Base vehicle and configuration data are required' });
    }

    const newDesign = new StudioDesign({
      clientInfo,
      baseVehicle,
      configurationData,
      message
    });

    const savedDesign = await newDesign.save();
    res.status(201).json({ message: 'Design saved successfully', design: savedDesign });
  } catch (error) {
    console.error('Error saving studio design:', error);
    res.status(500).json({ message: 'Server error saving design', error: error.message });
  }
};

// @desc    Get all saved designs (Admin)
// @route   GET /api/studio/designs
exports.getAllDesigns = async (req, res) => {
  try {
    const designs = await StudioDesign.find().sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ message: 'Server error fetching designs' });
  }
};

// @desc    Get single design by ID (Admin)
// @route   GET /api/studio/designs/:id
exports.getDesignById = async (req, res) => {
  try {
    const design = await StudioDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.status(200).json(design);
  } catch (error) {
    console.error('Error fetching design:', error);
    res.status(500).json({ message: 'Server error fetching design' });
  }
};

// @desc    Update design status (Admin)
// @route   PATCH /api/studio/designs/:id/status
exports.updateDesignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const design = await StudioDesign.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    
    res.status(200).json(design);
  } catch (error) {
    console.error('Error updating design status:', error);
    res.status(500).json({ message: 'Server error updating design status' });
  }
};
