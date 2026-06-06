const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt normal connection
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rashi-dreamy-gifts', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000, // Timeout after 2 seconds to trigger fallback quickly
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Could not connect to MongoDB at local URI. Starting in-memory MongoDB fallback...`);
    try {
      process.env.MONGOMS_VERSION = '4.0.28';
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    } catch (innerError) {
      console.error(`Failed to start in-memory MongoDB: ${innerError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
