import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.js';

dotenv.config();

const testAdminLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "appdata"
    });
    console.log('Connected to MongoDB');

    const admin = await UserModel.findOne({ email: 'admin@rentit.com' });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    const password = 'Admin@123';
    const isMatch = await bcrypt.compare(password, admin.password);
    
    console.log('Password comparison result:', isMatch);
    console.log('Stored hashed password:', admin.password);
    console.log('Attempted password:', password);
    
  } catch (error) {
    console.error('Error testing admin login:', error);
  } finally {
    await mongoose.disconnect();
  }
};

testAdminLogin(); 