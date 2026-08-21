const mongoose = require('mongoose');

const buildInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  chassis: { type: String },
  placedModules: { type: Array, default: [] }, // From the Studio 2D planner
  message: { type: String, required: true },
  source: { type: String, enum: ['studio', 'contact'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('BuildInquiry', buildInquirySchema);
