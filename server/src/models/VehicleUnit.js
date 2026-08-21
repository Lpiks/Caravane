const mongoose = require('mongoose');

const vehicleUnitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['sale', 'rental'], required: true },
  chassis: { type: String, required: true },
  price: { type: String, required: true }, // Using string for formatted currency "€65,000" or "DZD 9,500,000"
  specs: {
    sleeps: { type: Number, required: true },
    solarWatts: { type: Number, required: true },
    waterLiters: { type: Number, required: true },
    transmission: { type: String, default: 'Manual' }
  },
  status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available' },
  images: [{ type: String }], // Array of image URLs/paths
  fullDescription: { type: String }, // Detailed description for the vehicle page
  imageColor: { type: String, default: 'from-[#0284c7] to-[#0369a1]' } // Fallback UI color if no image
}, { timestamps: true });

module.exports = mongoose.model('VehicleUnit', vehicleUnitSchema);
