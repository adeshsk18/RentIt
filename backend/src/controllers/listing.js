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

  // Apply property type filter
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
      query.numberOfBedrooms = numBedrooms;
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

  // Execute the query with all filters
  const properties = await PropertyModel.find(query).select(
    "-description -listedBy -legalDocumentId -status -isApproved"
  );

  // Apply address filter after fetching properties if needed
  let filteredProperties = properties;
  if (address && address.trim()) {
    const searchTerm = address.trim().toLowerCase();
    filteredProperties = properties.filter(p =>
      p.location && p.location.address &&
      p.location.address.toLowerCase().includes(searchTerm)
    );
    console.log(`Filtered properties by address substring: found ${filteredProperties.length}`);
  }

  console.log(`Found ${filteredProperties.length} properties matching the query`);

  res.status(200).json({
    message,
    properties: filteredProperties,
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
