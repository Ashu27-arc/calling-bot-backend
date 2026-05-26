const AgentSetting = require('../models/AgentSetting');

const getSettings = async (req, res) => {
  try {
    let settings = await AgentSetting.findOne({ userId: req.user._id });
    if (!settings) {
      settings = await AgentSetting.create({ userId: req.user._id });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await AgentSetting.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
