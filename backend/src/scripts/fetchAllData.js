import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "../models/user.js";
import { PropertyModel } from "../models/property.js";
import { RequestModel } from "../models/propertyRequest.js";
import { OwnerRequestModel } from "../models/ownerRequest.js";

// Load environment variables
dotenv.config();

async function fetchAllData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "appdata",
    });
    console.log("Connected to MongoDB successfully!");

    // Fetch all users
    const users = await UserModel.find({}).select("-password");
    console.log("\n=== USERS ===");
    console.log(`Total Users: ${users.length}`);
    users.forEach(user => {
      console.log(`\nUser ID: ${user._id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Type: ${user.type}`);
      console.log(`Username: ${user.username}`);
      console.log("------------------------");
    });

    // Fetch all properties
    const properties = await PropertyModel.find({});
    console.log("\n=== PROPERTIES ===");
    console.log(`Total Properties: ${properties.length}`);
    properties.forEach(property => {
      console.log(`\nProperty ID: ${property._id}`);
      console.log(`Title: ${property.title}`);
      console.log(`Listed By: ${property.listedBy}`);
      console.log(`Status: ${property.status}`);
      console.log(`Rent: ${property.rent}`);
      console.log(`Location: ${property.location.address}`);
      console.log("------------------------");
    });

    // Fetch all property requests
    const requests = await RequestModel.find({});
    console.log("\n=== PROPERTY REQUESTS ===");
    console.log(`Total Requests: ${requests.length}`);
    requests.forEach(request => {
      console.log(`\nRequest ID: ${request._id}`);
      console.log(`Property ID: ${request.propertyId}`);
      console.log(`Requester ID: ${request.requesterId}`);
      console.log(`Status: ${request.status}`);
      console.log(`Created At: ${request.createdAt}`);
      console.log("------------------------");
    });

    // Fetch all owner requests
    const ownerRequests = await OwnerRequestModel.find({});
    console.log("\n=== OWNER REQUESTS ===");
    console.log(`Total Owner Requests: ${ownerRequests.length}`);
    ownerRequests.forEach(request => {
      console.log(`\nRequest ID: ${request._id}`);
      console.log(`Requester ID: ${request.requesterId}`);
      console.log(`Status: ${request.status}`);
      console.log(`Timestamp: ${request.timestamp}`);
      console.log("------------------------");
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed.");
  }
}

// Run the script
fetchAllData(); 