const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String,
      required: true,
      default: '919876543210', // Default phone number format (with country code, no symbols)
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
