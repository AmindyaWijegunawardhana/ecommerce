const User = require('../models/User');
const Settings = require('../models/Settings');

const seedData = async () => {
  try {
    // 1. Seed Admin User
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      
      await User.create({
        username,
        password,
        role: 'admin',
      });
      console.log(`Seeded default admin user: ${username}`);
    }

    // 2. Seed Settings
    let settings = await Settings.findOne();
    const whatsappNumber = process.env.DEFAULT_WHATSAPP || '+94707066217';
    const deliveryCharge = process.env.DEFAULT_DELIVERY_CHARGE || 50;

    if (!settings) {
      await Settings.create({
        whatsappNumber,
        deliveryCharge,
      });
      console.log(`Seeded default settings. WhatsApp: ${whatsappNumber}, Delivery: ${deliveryCharge}`);
    } else {
      // If settings exist, ensure it has the plus sign if it's the old default
      if (settings.whatsappNumber === '94707066217') {
        settings.whatsappNumber = '+94707066217';
        await settings.save();
        console.log(`Updated existing default settings WhatsApp to +94707066217`);
      }
    }
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
  }
};

module.exports = seedData;
