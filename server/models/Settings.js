const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String,
      required: true,
      default: '+94707066217',
    },
    deliveryCharge: {
      type: Number,
      required: true,
      default: 50.0,
    },
    storeName: {
      type: String,
      required: true,
      default: 'Rashi Dreamy Gifts',
    },
    socialLinks: {
      facebook: {
        type: String,
        default: '',
      },
      instagram: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
