const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlaggedSchema = new Schema({
  flagNumber: Number,
  note: String
});

// Create Schema
const FlagLogSchema = new Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },

  flags: [FlaggedSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = FlagLog = mongoose.model('flagLog', FlagLogSchema);
