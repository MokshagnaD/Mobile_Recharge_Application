const mongoose = require('mongoose');

// MongoDB connection string with environment variable support
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devakrishna0204_db_user:rechargeforramya@ramyakrishna.edroqry.mongodb.net/mobile-recharge?retryWrites=true&w=majority&appName=ramyakrishna';

let isConnected = false;

// Connect to MongoDB with timeout & graceful fallback
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    isConnected = false;
    console.warn('MongoDB connection failed. Operating in resilient memory mode:', error.message);
    return false;
  }
};

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.warn('Mongoose connection warning:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('Mongoose disconnected');
});

process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});

module.exports = { connectDB, getIsConnected: () => isConnected };
