const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  description: String,
  targetDate: String,
  completed: { type: Boolean, default: false },
});

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  deadline: String,
  impactPoints: Number,
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ['completed', 'in progress', 'upcoming'], default: 'upcoming' },
  milestones: [MilestoneSchema]
});

module.exports = mongoose.model('Goal', GoalSchema);
