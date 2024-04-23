const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TorIpSchema = new Schema({
  ip: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = TorIp = mongoose.model('torIp', TorIpSchema);
