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
    const settingsExist = await Settings.findOne();
    if (!settingsExist) {
      const whatsappNumber = process.env.DEFAULT_WHATSAPP || '94707066217';
      const deliveryCharge = process.env.DEFAULT_DELIVERY_CHARGE || 50;

      await Settings.create({
        whatsappNumber,
        deliveryCharge,
      });
      console.log(`Seeded default settings. WhatsApp: ${whatsappNumber}, Delivery: ${deliveryCharge}`);
    }
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
  }
};

module.exports = seedData;
