const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
  const goals = await Goal.find();
  res.json(goals);
};

exports.getGoal = async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) return res.status(404).send('Goal not found');
  res.json(goal);
};

exports.createGoal = async (req, res) => {
  const goal = new Goal(req.body);
  await goal.save();
  res.status(201).json(goal);
};

exports.updateGoal = async (req, res) => {
  const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(goal);
};

exports.deleteGoal = async (req, res) => {
  await Goal.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

exports.updateProgress = async (req, res) => {
  try {
    const { progress, milestones } = req.body;

    const status = progress === 100 ? 'completed' : 'in progress';

    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).send('Goal not found');

    goal.progress = progress;
    goal.status = status;

    if (milestones && Array.isArray(milestones)) {
      milestones.forEach((updatedMilestone) => {
        const milestone = goal.milestones.id(updatedMilestone._id);
        if (milestone) {
          milestone.completed = updatedMilestone.completed;
          milestone.description = updatedMilestone.description || milestone.description;
          milestone.targetDate = updatedMilestone.targetDate || milestone.targetDate;
        }
      });
    }

    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.toggleMilestone = async (req, res) => {
  const { goalId, milestoneId } = req.params;
  const goal = await Goal.findById(goalId);
  const milestone = goal.milestones.id(milestoneId);
  if (!milestone) return res.status(404).send('Milestone not found');

  milestone.completed = !milestone.completed;
  await goal.save();
  res.json(goal);
};
