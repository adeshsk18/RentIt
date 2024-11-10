import { getReceiverSocketId, io } from "../config/socket.js";
import ValidationError from "../lib/errors.js";
import { controllerWrapper, deleteImage, getChoppedID } from "../lib/utils.js";
import {
  validateAddress,
  validateAmenities,
  validateDescription,
  validateImages,
  validateLegaldocId,
  validateNumberOfBedrooms,
  validatePropertyAndUser,
  validatePropertyType,
  validateRent,
  validateRequestAndUser,
  validateTitle,
} from "../lib/validators.js";
import { PropertyModel } from "../models/property.js";

const validStatuses = ["unlisted", "available"];

const keysToUpdate = [
  "title",
  "description",
  "amenities",

  "rent",
  "propertyType",
  "numberOfBedrooms",
  "legalDocumentId",
];

const validationMap = {
  title: validateTitle,
  description: validateDescription,
  amenities: validateAmenities,
  address: validateAddress,
  rent: validateRent,
  propertyType: validatePropertyType,
  numberOfBedrooms: validateNumberOfBedrooms,
};

export const addProperty = controllerWrapper(async (req, res) => {
  const {
    address,

    title,
    description,
    rent,
    propertyType,
    numberOfBedrooms,
    amenities,

    legalDocumentId,
  } = req.body;

  const images = req.files ? req.files.map((file) => file.path) : [];
  validateImages(images.length);

  const processedTitle = validateTitle(title);
  const processedAddress = validateAddress(address);
  const processedDescription = validateDescription(description);
  const processedRent = validateRent(rent);
  const processedPropertyType = validatePropertyType(propertyType);
  const processedAmenities = validateAmenities(amenities);
  const processedNumberOfBedrooms = validateNumberOfBedrooms(numberOfBedrooms);
  const processedDocID = await validateLegaldocId(legalDocumentId);

  if (!processedDocID) {
    const waitingProp = await PropertyModel.findOne({
      listedBy: req.user._id,
      status: "waiting",
    });

    if (waitingProp) {
      throw new ValidationError(
        "Can't add new property, one of your old property is not approved yet, try adding with property's legal Document ID"
      );
    }
  }

  const newProperty = new PropertyModel({
    location: {
      address: processedAddress,
    },
    title: processedTitle,
    description: processedDescription,
    rent: processedRent,
    propertyType: processedPropertyType,
    numberOfBedrooms: processedNumberOfBedrooms,
    amenities: processedAmenities,
    images,
    listedBy: req.user._id,
    legalDocumentId: processedDocID,
  });
  await newProperty.save();

  res.status(200).json({ message: "Property added successfully" });
});

export const updateProperty = controllerWrapper(async (req, res) => {
  const { propertyId } = req.params;
  const property = await validatePropertyAndUser(propertyId, req.user);

  const newImages = req.files ? req.files.map((file) => file.path) : [];
  const removeImages =
    req.body.removeImages && Array.isArray(req.body.removeImages)
      ? req.body.removeImages
      : [];

  const totalImages =
    property.images.length + newImages.length - removeImages.length;

  req.body.legalDocumentId = await validateLegaldocId(req.body.legalDocumentId);

  if (req.body.legalDocumentId && property.legalDocumentId) {
    throw new ValidationError(
      "Can not change Legal Document ID after it is verified & approved."
    );
  }

  try {
    validateImages(totalImages);
    if (
      property.status === "occupied" &&
      new Date() <= new Date(property.releaseDate)
    ) {
      throw new ValidationError(
        `The Property is occupied & can't edit it ${new Date(property.releaseDate).toDateString()}.`
      );
    }
  } catch (err) {
    newImages.forEach((imagePath) => {
      deleteImage(imagePath);
    });

    throw err;
  }

  if (removeImages.length > 0) {
    removeImages.forEach((imagePath) => {
      deleteImage(imagePath);
    });
    property.images = property.images.filter(
      (image) => !removeImages.includes(image)
    );
  }

  keysToUpdate.forEach((key) => {
    if (req.body[key]) {
      const validatedValue = validationMap[key]
        ? validationMap[key](req.body[key])
        : req.body[key];

      if (key === "address") {
        property.location.address = validatedValue;
      } else {
        property[key] = validatedValue;
      }
    }
  });

  property.images = [...property.images, ...newImages];

  await property.save();

  res.status(200).json({ message: "Property updated successfully" });
});

export const changePropertyStatus = controllerWrapper(async (req, res) => {
  const { propertyId } = req.params;
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    throw new ValidationError("Invalid Status Provided");
  }

  const property = await validatePropertyAndUser(propertyId, req.user);

  if (!property.isApproved) {
    throw new ValidationError("Can't change status of not approved properties");
  }

  if (
    property.status === "occupied" &&
    new Date() <= new Date(property.releaseDate)
  ) {
    throw new ValidationError(
      `The Property is occupied & can't change the status till ${new Date(property.releaseDate).toDateString()}.`
    );
  }
  if (property.status === "occupied") {
    property.releaseDate = null;
  }

  property.status = status;
  await property.save();

  res.status(200).json({
    message: "Property status updated successfully.",
  });
});

export const deleteProperty = controllerWrapper(async (req, res) => {
  const { propertyId } = req.params;

  const property = await validatePropertyAndUser(propertyId, req.user);

  const currDate = new Date();
  if (property.status === "occupied" && property.releaseDate <= currDate) {
    throw new ValidationError(
      `You can't delete this property till ${currDate.toDateString()}.`
    );
  }

  property.images.forEach((imagePath) => {
    deleteImage(imagePath);
  });

  await PropertyModel.deleteOne({ _id: propertyId });

  res.status(200).json({ message: "Property deleted successfully" });
});

export const getPropertyDetails = controllerWrapper(async (req, res) => {
  const { propertyId } = req.params;

  const property = await validatePropertyAndUser(propertyId, req.user);

  property.legalDocumentId = getChoppedID(property.legalDocumentId);

  res
    .status(200)
    .json({ message: "Property retrieved successfully.", property });
});

export const getAllProperties = controllerWrapper(async (req, res) => {
  const listedBy = req.user._id;

  const properties = await PropertyModel.find({ listedBy })
    .sort({ createdAt: -1 })
    .select("-legalDocumentId -isApproved -listedBy -releaseDate");

  res.status(200).json({
    properties,
    message: "User Properties Retrieved successfully.",
  });
});

//export const getPropertyRequests = controllerWrapper(async (req, res) => {
//  const { propertyId } = req.params;
//
//  await validatePropertyAndUser(propertyId, req.user);
//
//  const requests = await RequestModel.find({ propertyId }).populate({
//    path: "requesterId",
//    select: "name username profilePicture contactNumber",
//  });
//
//  res.status(200).json({
//    requests,
//    userId: req.user._id,
//    message: "Requests Retrieved successfully",
//  });
//});
//
/*
 * Chat functions & Real time updating logic
 *
 */

export const respondeToRequest = controllerWrapper(async (req, res) => {
  const { requestId } = req.params;
  const { flag } = req.body;

  if (!["accepted", "rejected"].includes(flag)) {
    throw new ValidationError("Invalid flag.");
  }

  const request = await validateRequestAndUser(requestId, req.user, true);

  if (request.status !== "pending") {
    throw new ValidationError("Can only change the flag of a pending request.");
  }

  request.status = flag;

  request.messages.push({
    user_id: null,
    type: "txt",
    message: `${req.user.name} ${flag.toUpperCase()} the request`,
    timestamp: new Date(),
  });
  request.rseen = false;
  await request.save();

  const receiver = getReceiverSocketId(request.requesterId);

  const updatedFields = {
    status: request.status,
    messages: request.messages,
    date: request.date,
    _id: request._id,
    rseen: request.rseen,
    lseen: request.lseen,
  };

  if (receiver) {
    io.to(receiver).emit("stateChange", { request: updatedFields });
  }

  res
    .status(200)
    .json({ message: "flag set to request", request: updatedFields });
});

export const sendAgreement = controllerWrapper(async (req, res) => {
  const { requestId } = req.params;

  const { startd, endd, rent, optMessage } = req.body;

  if (optMessage && optMessage.length > 250) {
    throw new ValidationError("Message length is greater than 250 characters.");
  }

  const request = await validateRequestAndUser(requestId, req.user, true);

  if (!request.status.startsWith("acc")) {
    throw new ValidationError("Can't send agreement anymore");
  }

  const newMessage = {
    user_id: req.user._id,
    type: "agg",
    message: optMessage || "",
    timestamp: new Date(),
    agreement: {
      startd,
      endd,
      rent,
      status: "open",
    },
  };

  request.messages.push(newMessage);

  await request.save();
  const savedMsg = request.messages[request.messages.length - 1];

  const updateData = {
    requestId,
    newMessage: savedMsg,
    rseen: request.rseen,
    lseen: request.lseen,
  };

  const receiver = getReceiverSocketId(request.requesterId);
  if (receiver) {
    io.to(receiver).emit("newMessage", updateData);
  }

  return res.status(200).json(updateData);
});
