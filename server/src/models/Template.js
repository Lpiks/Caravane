const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  chassisId: {
    type: String,
    required: true,
    index: true, // For quickly fetching templates by chassis
  },
  // We can store a URL or path to a generated thumbnail image eventually
  thumbnailUrl: {
    type: String,
    required: false,
  },
  // The layout modules
  modules: [{
    id: { type: String, required: true }, // unique id for the instance
    typeId: { type: String, required: true }, // id from components db
    name: { type: String, required: true },
    dimensions: { type: [Number], required: true },
    position: { type: [Number], required: true },
    rotation: { type: Number, required: true },
    layer: { type: String },
    defaultY: { type: Number },
    color: { type: String },
    weightKg: { type: Number },
    waterLiters: { type: Number },
    solarWattage: { type: Number },
    isBedMode: { type: Boolean }
  }],
}, {
  timestamps: true,
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
