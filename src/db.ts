import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      //dbName: 'admin', // optional: set a default DB name
    });
    console.log('✅ Connected to MongoDB via Mongoose');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // optional: stop the app if DB fails
  }
};