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
    maxDistance = 5,
    priceRange,
    numberOfBedrooms,
    amenities,
    propertyType,
  } = req.query;
  const { userId } = req.body;

  const query = {
    status: "available",
  };

  let message = "Properties retrieved successfully.";

  if (address) {
    const [cords, status] = await getGeocordinates(address);
    if (!status) {
      message = "Please Enter a valid location.";
    }

    const latitude = parseFloat(cords.lat);
    const longitude = parseFloat(cords.lon);

    query["location.coordinates"] = {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], maxDistance / 6378.1],
      },
    };
  }

  if (propertyType) {
    const propt = propertyType.toLowerCase().trim();
    query.propertyType = propt;
  }

  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split(",").map(Number);
    query.rent = { $gte: minPrice, $lte: maxPrice };
  }

  if (numberOfBedrooms) {
    query.numberOfBedrooms = { $gte: Number(numberOfBedrooms) };
  }

  if (amenities) {
    const amenitiesList = amenities.toLowerCase().split(",");
    query.amenities = { $all: amenitiesList };
  }

  if (userId) {
    const requests = await RequestModel.find({ requesterID: userId });
    const requestedPropertyIds = requests.map((request) => request.propertyId);
    query._id = { $nin: requestedPropertyIds };
  }

  const properties = await PropertyModel.find(query).select(
    "-description -listedBy -legalDocumentId -status -isApproved"
  );

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
