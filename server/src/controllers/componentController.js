const Component = require('../models/Component');
const fs = require('fs');
const path = require('path');

// @desc    Get all components
// @route   GET /api/components
// @access  Public (or Admin depending on your auth later)
exports.getComponents = async (req, res) => {
  try {
    const components = await Component.find().lean();
    res.json(components);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching components' });
  }
};

// @desc    Get single component by ID
// @route   GET /api/components/:id
// @access  Public
exports.getComponentById = async (req, res) => {
  try {
    const component = await Component.findOne({ id: req.params.id }).lean();
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json(component);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching component' });
  }
};

// @desc    Create a new component
// @route   POST /api/components
// @access  Public
exports.createComponent = async (req, res) => {
  try {
    // Check if component exists
    const existing = await Component.findOne({ id: req.body.id });
    if (existing) {
      return res.status(400).json({ message: 'Component with this ID already exists' });
    }
    
    const component = await Component.create(req.body);
    res.status(201).json(component);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating component' });
  }
};

// @desc    Update a component
// @route   PUT /api/components/:id
// @access  Public
exports.updateComponent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;

    const component = await Component.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!component) {
      // If it doesn't exist, we can create it (upsert behavior)
      const newComponent = await Component.create({ ...req.body, id: req.params.id });
      return res.status(201).json(newComponent);
    }
    
    res.json(component);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating component' });
  }
};

// @desc    Delete a component
// @route   DELETE /api/components/:id
// @access  Public
exports.deleteComponent = async (req, res) => {
  try {
    const component = await Component.findOneAndDelete({ id: req.params.id });
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json({ message: 'Component removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting component' });
  }
};

// Helper function to seed components if database is empty
exports.seedComponentsIfEmpty = async () => {
  try {
    const count = await Component.countDocuments();
    if (count === 0) {
      console.log('Seeding components database from baseComponents.json...');
      
      const categoryMap = {
        "kitchen-galley": "Kitchen & Galley", "upright-fridge": "Kitchen & Galley", "cooktop": "Kitchen & Galley", "gas-locker": "Kitchen & Galley",
        "shower-cabin": "Bathroom & Plumbing", "cassette-toilet": "Bathroom & Plumbing", "grey-water-tank": "Bathroom & Plumbing",
        "dinette-seating": "Living & Dining", "lagun-table": "Living & Dining", "swivel-seat": "Living & Dining", "bed-fixed": "Living & Dining", "sofa-bed": "Living & Dining", "tall-wardrobe": "Living & Dining", "engine-cushion": "Living & Dining",
        "water-tank-120": "Power & Utilities", "battery-bank": "Power & Utilities", "inverter-hub": "Power & Utilities", "diesel-heater": "Power & Utilities", "control-panel": "Power & Utilities", "cargo-tray": "Power & Utilities",
        "roof-ac": "Climate & Roof", "maxxair-fan": "Climate & Roof", "solar-array-400": "Climate & Roof", "overhead-locker": "Climate & Roof", "side-awning": "Climate & Roof", "pop-top-roof": "Climate & Roof"
      };

      const dataPath = path.join(__dirname, '../../../client/src/data/baseComponents.json');
      if (fs.existsSync(dataPath)) {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const components = JSON.parse(rawData);
        
        // Inject categories during import, preserving already defined categories
        const componentsWithCategories = components.map(c => ({
          ...c,
          category: c.category && c.category !== "Uncategorized" ? c.category : (categoryMap[c.id] || "Uncategorized")
        }));

        await Component.insertMany(componentsWithCategories);
        console.log('Successfully seeded components!');
      } else {
        console.log('baseComponents.json not found, skipping seed.');
      }
    }
  } catch (error) {
    console.error('Error seeding components:', error);
  }
};
