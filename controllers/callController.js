const CallLog = require('../models/CallLog');

const getCallLogs = async (req, res) => {
  try {
    const logs = await CallLog.find({ userId: req.user._id }).populate('contactId', 'name phone').sort('-startedAt');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCallLogs,
};
