const mongoose = require('mongoose');

const studioDesignSchema = new mongoose.Schema({
  clientInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  baseVehicle: { type: String, required: true }, // e.g., 'Sprinter', 'Crafter', 'Transit'
  configurationData: { type: mongoose.Schema.Types.Mixed, required: true }, // Stores flexible JSON containing 3D coordinates, colors, parts
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Contacted'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('StudioDesign', studioDesignSchema);
