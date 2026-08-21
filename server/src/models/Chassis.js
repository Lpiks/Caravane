const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  id: String,
  name: String,
  shape: String,
  size: mongoose.Schema.Types.Mixed,
  offset: mongoose.Schema.Types.Mixed,
  rotation: mongoose.Schema.Types.Mixed,
  color: String,
  opacity: Number,
  roughness: Number,
  metalness: Number,
  textString: String
}, { _id: false });

const chassisSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  chassisType: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  specs: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  defaultL: Number,
  defaultW: Number,
  defaultH: Number,
  centerX: {
    type: Number,
    default: 0
  },
  centerZ: {
    type: Number,
    default: 0
  },
  floorHeight: {
    type: Number,
    default: 0
  },
  states: {
    type: [String],
    default: ['default']
  },
  parts: [partSchema]
}, { timestamps: true });

module.exports = mongoose.model('Chassis', chassisSchema);
