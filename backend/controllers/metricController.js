const Metric = require('../models/Metric');

exports.createMetric = async (req, res) => {
  try {
    const { metrics, userId: bodyUserId } = req.body;
    const userId = req.user?._id || bodyUserId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing from token and body' });
    }

    const updatedMetric = await Metric.findOneAndUpdate(
      { userId },
      { metrics, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.status(201).json(updatedMetric);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create/update metric', error });
  }
};


exports.getMetrics = async (req, res) => {
  try {
    const metrics = await Metric.findOne({ userId: req.query.userId });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch metrics', error });
  }
};

exports.updateMetric = async (req, res) => {
  try {
    const metric = await Metric.findOneAndUpdate(
      { userId: req.body.userId },
      { metrics: req.body.metrics, lastUpdated: new Date() },
      { new: true }
    );
    if (!metric) return res.status(404).json({ message: 'Metric not found' });
    res.json(metric);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update metric', error });
  }
};

exports.deleteMetric = async (req, res) => {
  try {
    const metric = await Metric.findOneAndDelete({ userId: req.user._id });
    if (!metric) return res.status(404).json({ message: 'Metric not found' });
    res.json({ message: 'Metric deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete metric', error });
  }
};

exports.exportMetrics = async (req, res) => {
  try {
    const metricData = await Metric.findOne({ userId: req.user._id });
    if (!metricData) return res.status(404).json({ message: 'No metrics found' });

    const fields = ['name', 'value', 'unit', 'goal'];
    const opts = { fields };
    const parser = new (require('json2csv').Parser)(opts);
    const csv = parser.parse(metricData.metrics);

    res.header('Content-Type', 'text/csv');
    res.attachment('esg-metrics.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'CSV export failed', error: err });
  }
};