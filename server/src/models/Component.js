const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  id: String,
  name: String,
  shape: String,
  size: mongoose.Schema.Types.Mixed,
  offset: mongoose.Schema.Types.Mixed,
  rotation: mongoose.Schema.Types.Mixed,
  color: String,
  isColorable: Boolean,
  roughness: Number,
  metalness: Number,
  opacity: Number,
  visibleInStates: [String],
  textString: String,
  fontUrl: String
}, { _id: false });

const componentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  layer: {
    type: String,
    default: 'furniture'
  },
  placementX: {
    type: String,
    default: 'center'
  },
  type: {
    type: String,
    default: 'parametric'
  },
  defaultL: Number,
  defaultW: Number,
  defaultH: Number,
  icon: String,
  states: {
    type: [String],
    default: ['default']
  },
  chassisOverrides: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  compatibleChassis: {
    type: [String],
    default: ['compact-classic', 'standard-highroof', 'minibus-canvas']
  },
  parts: [partSchema]
}, { timestamps: true });

module.exports = mongoose.model('Component', componentSchema);
