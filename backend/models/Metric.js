const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  metrics: [
    {
      name: { type: String, required: true },
      unit: { type: String, required: true },
      value: { type: Number, required: true },
      goal: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model('Metric', metricSchema);