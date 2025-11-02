const express = require('express');
const router = express.Router();
const {
  createMetric,
  getMetrics,
  updateMetric,
  deleteMetric,
  exportMetrics
} = require('../controllers/metricController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createMetric)   
  .get(protect, getMetrics)      
  .put(protect, updateMetric)   
  .delete(protect, deleteMetric) 

router.get('/export', protect, exportMetrics);

module.exports = router;
