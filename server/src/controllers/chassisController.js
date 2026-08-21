const Chassis = require('../models/Chassis');
const fs = require('fs');
const path = require('path');

// @desc    Get all chassis blueprints
// @route   GET /api/chassis
// @access  Public
exports.getChassis = async (req, res) => {
  try {
    const chassis = await Chassis.find().lean();
    res.json(chassis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching chassis list' });
  }
};

// @desc    Get single chassis blueprint by ID
// @route   GET /api/chassis/:id
// @access  Public
exports.getChassisById = async (req, res) => {
  try {
    const chassis = await Chassis.findOne({ id: req.params.id }).lean();
    if (!chassis) {
      return res.status(404).json({ message: 'Chassis not found' });
    }
    res.json(chassis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching chassis blueprint' });
  }
};

// @desc    Create a new chassis blueprint
// @route   POST /api/chassis
// @access  Public
exports.createChassis = async (req, res) => {
  try {
    const existing = await Chassis.findOne({ id: req.body.id });
    if (existing) {
      return res.status(400).json({ message: 'Chassis with this ID already exists' });
    }
    
    const chassis = await Chassis.create(req.body);
    res.status(201).json(chassis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating chassis' });
  }
};

// @desc    Update or upsert a chassis blueprint
// @route   PUT /api/chassis/:id
// @access  Public
exports.updateChassis = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;

    const chassis = await Chassis.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!chassis) {
      // If it doesn't exist, create it (upsert behavior)
      const newChassis = await Chassis.create({ ...req.body, id: req.params.id });
      return res.status(201).json(newChassis);
    }
    
    res.json(chassis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating chassis' });
  }
};

// @desc    Delete a chassis blueprint
// @route   DELETE /api/chassis/:id
// @access  Public
exports.deleteChassis = async (req, res) => {
  try {
    const chassis = await Chassis.findOneAndDelete({ id: req.params.id });
    if (!chassis) {
      return res.status(404).json({ message: 'Chassis not found' });
    }
    res.json({ message: 'Chassis blueprint removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting chassis blueprint' });
  }
};

// Helper function to seed chassis models if database is empty
exports.seedChassisIfEmpty = async () => {
  try {
    const count = await Chassis.countDocuments();
    if (count === 0) {
      console.log('Seeding chassis database from baseChassis.json...');
      
      const dataPath = path.join(__dirname, '../../../client/src/data/baseChassis.json');
      if (fs.existsSync(dataPath)) {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const chassisList = JSON.parse(rawData);
        
        await Chassis.insertMany(chassisList);
        console.log('Successfully seeded chassis database!');
      } else {
        console.log('baseChassis.json not found at ' + dataPath + ', skipping seed.');
      }
    }
  } catch (error) {
    console.error('Error seeding chassis database:', error);
  }
};
