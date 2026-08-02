import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tourism-nepal';
    await mongoose.connect(connUri);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.warn('⚠️ MongoDB connection warning:', error.message);
    console.log('ℹ️ Server will continue running in fallback mode.');
  }
};

// Add this line at the bottom! 👇
export default connectDB;