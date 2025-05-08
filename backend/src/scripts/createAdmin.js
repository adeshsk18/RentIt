import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserModel } from '../models/user.js';

dotenv.config();

const checkAdminExists = async () => {
  try {
    const admin = await UserModel.findOne({ type: 'admin' });
    return !!admin;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
};

export const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "appdata"
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await checkAdminExists();
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const adminData = {
      username: 'admin123',
      email: 'admin@rentit.com',
      name: 'Admin User',
      password: 'Admin@123', // Let the schema's pre-save middleware handle the hashing
      type: 'admin'
    };

    const admin = new UserModel(adminData);
    await admin.save();
    
    console.log('Admin user created successfully');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Execute the function
createAdminUser(); 