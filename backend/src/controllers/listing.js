import mongoose from "mongoose";

import ValidationError from "../lib/errors.js";
import getGeocordinates from "../lib/geocode.js";
import { controllerWrapper } from "../lib/utils.js";
import { PropertyModel } from "../models/property.js";
import { RequestModel } from "../models/propertyRequest.js";
import { UserModel } from "../models/user.js";

export const getFilteredProperties = controllerWrapper(async (req, res) => {
  const { address, priceRange, numberOfBedrooms } = req.query;
  const { userId } = req.body;

  console.log("Search query received:", { address, priceRange, numberOfBedrooms });

  const query = {
    status: "available",
  };

  // Add address search with case-insensitive partial matching
  if (address && address.trim()) {
    query["location.address"] = {
      $regex: address.trim(),
      $options: "i"
    };
  }

  // Add price range filter
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split(",").map(Number);
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      query.rent = { 
        $gte: minPrice,
        $lte: maxPrice
      };
    }
  }

  // Add number of bedrooms filter
  if (numberOfBedrooms) {
    const bedrooms = Number(numberOfBedrooms);
    if (!isNaN(bedrooms)) {
      query.numberOfBedrooms = bedrooms;
    }
  }

  // Exclude properties already requested by the user
  if (userId) {
    const requests = await RequestModel.find({ requesterID: userId });
    const requestedPropertyIds = requests.map((request) => request.propertyId);
    query._id = { $nin: requestedPropertyIds };
  }

  console.log("Final query being executed:", JSON.stringify(query, null, 2));

  const properties = await PropertyModel.find(query).select(
    "-description -listedBy -legalDocumentId -status -isApproved"
  );

  console.log(`Found ${properties.length} properties matching the query`);

  res.status(200).json({
    message: "Properties retrieved successfully",
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
