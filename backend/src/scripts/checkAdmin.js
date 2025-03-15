import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserModel } from '../models/user.js';

dotenv.config();

const checkAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "appdata"
    });
    console.log('Connected to MongoDB');

    const admin = await UserModel.findOne({ email: 'admin@rentit.com' });
    console.log('Admin user found:', admin);
    
  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkAdminUser(); 