const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String,
      required: true,
      default: '+94707066217', // Default phone number format (with country code, optionally symbols)
    },
    deliveryCharge: {
      type: Number,
      required: true,
      default: 50.0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
