const VehicleUnit = require('../models/VehicleUnit');

// Auto-seed dummy data if database is empty
const seedVehiclesIfEmpty = async () => {
  try {
    const count = await VehicleUnit.countDocuments();
    if (count === 0) {
      console.log('Seeding initial vehicle catalog...');
      await VehicleUnit.insertMany([
        {
          title: "VW T3 Classic Overland",
          type: "sale",
          chassis: "Volkswagen T3 (1988)",
          price: "DZD 3,500,000",
          specs: { sleeps: 2, solarWatts: 200, waterLiters: 60, transmission: "Manual 4WD" },
          status: "available",
          imageColor: "from-[#C85A32] to-[#b45309]" // Terracotta / Amber
        },
        {
          title: "Renault Master High-Roof",
          type: "sale",
          chassis: "Renault Master L3H2",
          price: "DZD 8,200,000",
          specs: { sleeps: 3, solarWatts: 400, waterLiters: 150, transmission: "Manual" },
          status: "reserved",
          imageColor: "from-[#181A1D] to-[#2E4A3E]" // Obsidian / Green
        },
        {
          title: "Toyota Coaster Nomad",
          type: "rental",
          chassis: "Toyota Coaster Minibus",
          price: "DZD 25,000 / Day",
          specs: { sleeps: 4, solarWatts: 600, waterLiters: 300, transmission: "Automatic" },
          status: "available",
          imageColor: "from-[#0284c7] to-[#0369a1]" // Azure
        }
      ]);
      console.log('Initial catalog seeded successfully.');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// Export the seed function so it can be safely called after DB connection
exports.seedVehiclesIfEmpty = seedVehiclesIfEmpty;

// GET /api/vehicles
exports.getVehicles = async (req, res) => {
  try {
    // Optional filter by query parameter (e.g., /api/vehicles?type=sale)
    const filter = req.query.type ? { type: req.query.type } : {};
    const vehicles = await VehicleUnit.find(filter).sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new vehicle (Admin)
// @route   POST /api/vehicles
exports.createVehicle = async (req, res) => {
  try {
    const newVehicle = new VehicleUnit(req.body);
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating vehicle', error: error.message });
  }
};

// @desc    Update a vehicle (Admin)
// @route   PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await VehicleUnit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating vehicle', error: error.message });
  }
};

// @desc    Delete a vehicle (Admin)
// @route   DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await VehicleUnit.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting vehicle' });
  }
};
