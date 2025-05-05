import mongoose from "mongoose";

import ValidationError from "../lib/errors.js";
import getGeocordinates from "../lib/geocode.js";
import { controllerWrapper } from "../lib/utils.js";
import { PropertyModel } from "../models/property.js";
import { RequestModel } from "../models/propertyRequest.js";
import { UserModel } from "../models/user.js";

export const getFilteredProperties = controllerWrapper(async (req, res) => {
  const {
    address,
    propertyType,
    priceRange,
    numberOfBedrooms,
    amenities,
  } = req.query;
  const { userId } = req.body;

  console.log("Search query received:", { address, propertyType, priceRange, numberOfBedrooms, amenities });

  const query = {
    status: "available",
  };

  let message = "Properties retrieved successfully.";

  let properties;
  if (address && address.trim()) {
    const searchTerm = address.trim().toLowerCase();
    // Fetch all available properties and filter in JS for substring match
    properties = await PropertyModel.find(query).select(
      "-description -listedBy -legalDocumentId -status -isApproved"
    );
    properties = properties.filter(p =>
      p.location && p.location.address &&
      p.location.address.toLowerCase().includes(searchTerm)
    );
    console.log(`Filtered properties by address substring: found ${properties.length}`);
  } else {
    properties = await PropertyModel.find(query).select(
      "-description -listedBy -legalDocumentId -status -isApproved"
    );
  }

  if (propertyType) {
    const propt = propertyType.toLowerCase().trim();
    query.propertyType = propt;
  }

  // Price range filter
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split(",").map(Number);
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      query.rent = { $gte: minPrice, $lte: maxPrice };
    }
  }

  // Bedrooms filter - exact match
  if (numberOfBedrooms) {
    const numBedrooms = Number(numberOfBedrooms);
    if (!isNaN(numBedrooms)) {
      query.numberOfBedrooms = numBedrooms; // Exact match
    }
  }

  // Amenities filter
  if (amenities) {
    const amenitiesList = amenities.toLowerCase().split(",").filter(a => a.trim() !== "");
    if (amenitiesList.length > 0) {
      query.amenities = { $all: amenitiesList };
    }
  }

  if (userId) {
    const requests = await RequestModel.find({ requesterID: userId });
    const requestedPropertyIds = requests.map((request) => request.propertyId);
    query._id = { $nin: requestedPropertyIds };
  }

  console.log("Final query being executed:", JSON.stringify(query, null, 2));

  // Log the first few properties found to verify the search
  if (properties.length > 0) {
    console.log("Sample property addresses found:", properties.slice(0, 3).map(p => p.location.address));
  }

  console.log(`Found ${properties.length} properties matching the query`);

  res.status(200).json({
    message,
    properties,
  });
});

export const getPropertyById = controllerWrapper(async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId || !mongoose.isValidObjectId(propertyId)) {
    throw new ValidationError("Invalid ID String");
  }

  const property = await PropertyModel.findById(propertyId)
    .populate({
      path: "listedBy",
      select: "name username profilePicture legalVerificationID contactNumber",
    })
    .select("-isApproved -legalDocumentId");

  if (!property) {
    throw new ValidationError("Property not Found", 404);
  }

  property.listedBy.legalVerificationID =
    !!property.listedBy.legalVerificationID;

  res.status(200).json({
    message: "Property retrieved successfully",
    property,
  });
});

export const getPublicUserDetails = controllerWrapper(async (req, res) => {
  const { username } = req.params;

  const user = await UserModel.findOne({ username })
    .select("-password -contactNumber -email")
    .lean();

  if (!user) {
    throw new ValidationError("User Doesn't Exist!");
  }

  user.legalVerificationID = !!user.legalVerificationID;

  const properties = await PropertyModel.find({
    listedBy: user._id,
    status: "available",
  }).select("-description -listedBy -legalDocumentId -status -isApproved");

  return res
    .status(200)
    .json({ message: "Data retrieved successfully", properties, user });
});
