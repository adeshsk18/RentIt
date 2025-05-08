import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createAdminUser } from './createAdmin.js';

dotenv.config();

const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "appdata"
    });
    console.log('Connected to MongoDB');

    // Create admin user if it doesn't exist
    await createAdminUser();

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Execute the initialization
initializeDatabase(); 