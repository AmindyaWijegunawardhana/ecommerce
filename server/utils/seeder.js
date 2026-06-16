const User = require('../models/User');
const Settings = require('../models/Settings');
const Category = require('../models/Category');
const Product = require('../models/Product');

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
        storeName: 'Rashi Dreamy Gifts',
        socialLinks: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
        },
      });
      console.log(`Seeded default settings. WhatsApp: ${whatsappNumber}, Delivery: ${deliveryCharge}`);
    } else {
      // Migrate old settings if fields are missing
      let isUpdated = false;
      if (!settings.storeName) {
        settings.storeName = 'Rashi Dreamy Gifts';
        isUpdated = true;
      }
      if (!settings.socialLinks || !settings.socialLinks.facebook) {
        settings.socialLinks = {
          facebook: settings.socialLinks?.facebook || 'https://facebook.com',
          instagram: settings.socialLinks?.instagram || 'https://instagram.com',
        };
        isUpdated = true;
      }
      if (settings.whatsappNumber === '94707066217') {
        settings.whatsappNumber = '+94707066217';
        isUpdated = true;
      }
      if (isUpdated) {
        await settings.save();
        console.log('Updated settings with dynamic brand and social link entries.');
      }
    }

    // 3. Seed Default Categories
    const defaultCategories = [
      { name: 'Gift Boxes', description: 'Hand-picked premium hampers and fancy box collections' },
      { name: 'Soft Toys', description: 'Cuddly teddy bears and plush toys' },
      { name: 'Flowers', description: 'Fresh, beautiful floral bouquets and luxury floral arrangements' },
      { name: 'Jewelry', description: 'Elegant and sparkly necklaces, rings, and premium accessories' },
      { name: 'Accessories', description: 'Chic lifestyle items, custom mugs, and trendy gifts' }
    ];

    const seededCategories = {};
    for (const cat of defaultCategories) {
      let existingCat = await Category.findOne({ name: cat.name });
      if (!existingCat) {
        existingCat = await Category.create(cat);
        console.log(`Seeded category: ${cat.name}`);
      }
      seededCategories[cat.name] = existingCat._id;
    }

    // 4. Seed Premium Sample Products
    const defaultProducts = [
      {
        name: 'Royal Lavender Hamper',
        description: 'A luxurious gift box filled with soothing lavender spa essentials, scented candles, and organic sweet treats. The perfect premium pamper pack.',
        price: 2450,
        images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop'],
        categoryName: 'Gift Boxes',
        stock: 12,
        featured: true
      },
      {
        name: 'Midnight Pink Floral Box',
        description: 'An elegant black gift box holding handcrafted pastel pink roses paired with custom artisan chocolates. Designed to express deep feelings.',
        price: 1850,
        images: ['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop'],
        categoryName: 'Gift Boxes',
        stock: 15,
        featured: false
      },
      {
        name: 'Fluffy Teddy Bear Combo',
        description: 'A super-soft and huggable pink teddy bear coupled with a personalized message card. An adorable birthday or anniversary surprise.',
        price: 1200,
        images: ['https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop'],
        categoryName: 'Soft Toys',
        stock: 8,
        featured: true
      },
      {
        name: 'Elegant Red Roses Bouquet',
        description: 'A classic collection of twelve fresh, long-stemmed red roses, beautifully wrapped in premium tissue with a golden silk ribbon.',
        price: 1500,
        images: ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=600&auto=format&fit=crop'],
        categoryName: 'Flowers',
        stock: 10,
        featured: true
      },
      {
        name: 'Classic Rose Gold Pendant',
        description: 'A delicate 18k rose gold heart pendant encrusted with fine premium zircons. Comes packaged in a premium velvet drawer box.',
        price: 3200,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'],
        categoryName: 'Jewelry',
        stock: 5,
        featured: true
      },
      {
        name: 'Artisan Hair Accessories Set',
        description: 'A hand-selected pack of dynamic pastel hair claws, pearl clips, and silk scrunchies. Modern fashion accessories with feminine aesthetic packaging.',
        price: 650,
        images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop'],
        categoryName: 'Accessories',
        stock: 20,
        featured: false
      }
    ];

    for (const prod of defaultProducts) {
      const existingProd = await Product.findOne({ name: prod.name });
      if (!existingProd) {
        const catId = seededCategories[prod.categoryName];
        if (catId) {
          await Product.create({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            images: prod.images,
            category: catId,
            stock: prod.stock,
            featured: prod.featured
          });
          console.log(`Seeded product: ${prod.name}`);
        }
      }
    }

  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
  }
};

module.exports = seedData;
