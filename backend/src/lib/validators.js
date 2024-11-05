import mongoose from "mongoose";

import {
  availableAmenities,
  availablePropertyTypes,
} from "../config/constants.js";
import ValidationError from "../lib/errors.js";
import { PropertyModel } from "../models/property.js";
import { RequestModel } from "../models/propertyRequest.js";
import { UserModel } from "../models/user.js";
import { calculateDays, checkUserLegalVerID } from "./utils.js";

export const validateRequestAndUser = async (
  requestId,
  user,
  listerOnly = false
) => {
  if (!requestId || !mongoose.isValidObjectId(requestId)) {
    throw new ValidationError("Invalid ID String.");
  }
  const userId = String(user._id);
  const request = await RequestModel.findById(requestId);

  if (!request) {
    throw new ValidationError("Request not available.");
  }

  const isRequester = !listerOnly && String(request.requesterId._id) === userId;
  const isLister = String(request.listedBy) === userId;
  if (!(isRequester || isLister)) {
    throw new ValidationError("You are not authorized to access this request.");
  }
  if (request.status === "finalized" && calculateDays(request.date) > 15) {
    throw new ValidationError("This request is expired");
  }

  return request;
};

export const validatePropertyAndUser = async (propertyId, user) => {
  if (!propertyId || !mongoose.isValidObjectId(propertyId)) {
    throw new ValidationError("Invalid ID String.");
  }

  const property = await PropertyModel.findById(propertyId);

  if (!property) {
    throw new ValidationError("Property doesn't exists");
  }

  if (!user || property.listedBy.toString() !== user._id.toString()) {
    throw new ValidationError(
      "Permission Denied! You are not allowed to access this."
    );
  }
  return property;
};

export const validateImages = (length) => {
  if (length < 3 || length > 10) {
    throw new ValidationError(
      `You must provide between 3 and 10 images. You provided ${length}.`
    );
  }
};

export const validateLegaldocId = async (legalDocId) => {
  if (!legalDocId || legalDocId.length === 9) {
    return undefined;
  }

  const trimmedID = legalDocId ? legalDocId.trim().toLowerCase() : "";

  if (trimmedID.length < 12) {
    throw new ValidationError("Document ID lenght should be greater than 12");
  }

  const prop = await PropertyModel.findOne({ legalDocumentId: trimmedID });

  if (prop) {
    throw new ValidationError(
      "Given Legal Document ID already exists and is not belong to your property."
    );
  }
  return trimmedID;
};

export const validateTitle = (title) => {
  const trimmedTitle = title ? title.trim() : "";
  if (!trimmedTitle || trimmedTitle.length < 5 || trimmedTitle.length > 20) {
    throw new ValidationError(
      "Title length should be between 5 to 20 characters."
    );
  }
  return trimmedTitle;
};

export const validateAddress = (address) => {
  const trimmedAddress = address ? address.trim().toLowerCase() : "";
  if (
    !trimmedAddress ||
    trimmedAddress.length < 5 ||
    trimmedAddress.length > 100
  ) {
    throw new ValidationError(
      "Address length should be between 5 and 100 characters."
    );
  }
  return trimmedAddress;
};

export const validateDescription = (description) => {
  const trimmedDescription = description ? description.trim() : "";
  if (trimmedDescription && trimmedDescription.split(" ").length > 250) {
    throw new ValidationError("Description should not exceed 250 words.");
  }
  return trimmedDescription;
};

export const validateRent = (rent) => {
  const numericRent = Number(rent);
  if (isNaN(numericRent) || numericRent < 1000 || numericRent > 170000) {
    throw new ValidationError(
      "Rent should be a number between 1000 and 170000."
    );
  }
  return numericRent;
};

export const validatePropertyType = (propertyType) => {
  const lowercasedPropertyType = propertyType ? propertyType.toLowerCase() : "";

  if (!availablePropertyTypes.includes(lowercasedPropertyType)) {
    throw new ValidationError("Received invalid Property type.");
  }
  return lowercasedPropertyType;
};

export const validateAmenities = (amenities) => {
  if (typeof amenities === "string") {
    amenities = JSON.parse(amenities);
  }
  const lowercasedAmenities = amenities.map((amenity) =>
    amenity.toLowerCase().trim()
  );

  const invalidAmenities = lowercasedAmenities.filter(
    (amenity) => !availableAmenities.includes(amenity)
  );
  if (invalidAmenities.length) {
    throw new ValidationError(
      `Invalid amenities provided: ${invalidAmenities.join(", ")}.`
    );
  }
  return lowercasedAmenities;
};

export const validateNumberOfBedrooms = (numberOfBedrooms) => {
  const numericBedrooms = Number(numberOfBedrooms);
  if (isNaN(numericBedrooms) || numericBedrooms < 0 || numericBedrooms > 7) {
    throw new ValidationError("Number of bedrooms should be between 0 and 7.");
  }
  return numericBedrooms;
};

const unamePattern = /^[a-z0-9_.]+$/;
export const validateUsername = async (username, user) => {
  if (!username) {
    return null;
  }

  username = username.trim();

  const existingUser = await UserModel.findOne({
    username: username,
  });

  if (existingUser && existingUser._id.toString() !== user._id.toString()) {
    throw new ValidationError(
      "Username already taken. Please choose another username."
    );
  }

  if (!unamePattern.test(username)) {
    throw new ValidationError(
      "Username shouldn't contain any special characters and uppercase letters"
    );
  }

  if (username.length < 5 || username.length > 10) {
    throw new ValidationError("Username length should be between 5 to 10!");
  }
  return username;
};

export const validateUserVerID = async (legalVerificationID, user) => {
  if (!legalVerificationID || legalVerificationID.length === 9) {
    return undefined;
  }

  legalVerificationID = legalVerificationID
    ? legalVerificationID.trim().toLowerCase()
    : "";

  if (legalVerificationID.length < 12) {
    throw new ValidationError("Document ID lenght should be greater than 12");
  }
  const existingLegalVerID = await UserModel.findOne({
    legalVerificationID,
  });

  if (
    existingLegalVerID &&
    existingLegalVerID._id.toString() !== user._id.toString()
  ) {
    throw new ValidationError(
      "Legal Verification ID already exists. Please provide a unique Verification ID."
    );
  }

  if (!checkUserLegalVerID(legalVerificationID)) {
    throw new ValidationError("Please provide a correct Verification ID.");
  }
  return legalVerificationID;
};

export const validateContactNumber = async (contactNumber, user) => {
  if (!contactNumber) {
    return undefined;
  }

  contactNumber = contactNumber.trim();
  const existingContactNumber = await UserModel.findOne({
    contactNumber: contactNumber,
  });

  if (
    existingContactNumber &&
    existingContactNumber._id.toString() !== user._id.toString()
  ) {
    throw new ValidationError(
      "Contact number already in use. Please provide a different contact number."
    );
  }

  if (contactNumber.split(" ")[1].length <= 10) {
    throw new ValidationError("Invalid contact number.");
  }
  return contactNumber;
};

const namePattern = /^[a-zA-Z]+( [a-zA-Z]+)?$/;
export const validateName = (name) => {
  if (!name) {
    return undefined;
  }

  name = name.trim();
  if (!namePattern.test(name)) {
    throw new ValidationError(
      "Name should not contain any number or special characters."
    );
  }
  return name;
};

const emailPattern = /^\S+@\S+\.\S+$/;
export const validateEmail = (email) => {
  if (!email) {
    return undefined;
  }

  email = email.trim();
  if (!emailPattern.test(email)) {
    throw new ValidationError("Invalid Email address.");
  }
  return email;
};
