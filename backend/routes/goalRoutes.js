const express = require('express');
const router = express.Router();
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  updateProgress,
  toggleMilestone
} = require('../controllers/goalController');

router.get('/', getGoals);
router.get('/:id', getGoal);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.put('/:id/progress', updateProgress);
router.put('/:goalId/milestones/:milestoneId', toggleMilestone);

module.exports = router;
