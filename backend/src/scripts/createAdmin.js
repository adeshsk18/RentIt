import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserModel } from '../models/user.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "appdata"
    });
    console.log('Connected to MongoDB');

    // Delete any existing admin user first
    await UserModel.deleteOne({ email: 'admin@rentit.com' });

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
    console.log('Password: Admin@123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser(); 