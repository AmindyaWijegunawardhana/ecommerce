const Settings = require('../models/Settings');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      // Create default if somehow deleted or not initialized
      settings = await Settings.create({
        whatsappNumber: '+94707066217',
        deliveryCharge: 50.0,
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  const { whatsappNumber, deliveryCharge } = req.body;

  try {
    let settings = await Settings.findOne({});

    if (settings) {
      settings.whatsappNumber = whatsappNumber !== undefined ? whatsappNumber : settings.whatsappNumber;
      settings.deliveryCharge = deliveryCharge !== undefined ? Number(deliveryCharge) : settings.deliveryCharge;
      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      // Create new settings if not exist
      const newSettings = await Settings.create({
        whatsappNumber: whatsappNumber || '+94707066217',
        deliveryCharge: deliveryCharge !== undefined ? Number(deliveryCharge) : 50.0,
      });
      res.json(newSettings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
