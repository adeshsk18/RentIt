import mongoose from "mongoose";

import { getReceiverSocketId, io } from "../config/socket.js";
import ValidationError from "../lib/errors.js";
import {
  calculateDays,
  checkUpiAndPin,
  checkUserLegalVerID,
  controllerWrapper,
  deleteImage,
  generateUniqueUsername,
  getChoppedID,
} from "../lib/utils.js";
import {
  validateContactNumber,
  validateEmail,
  validateName,
  validateRequestAndUser,
  validateUserVerID,
  validateUsername,
} from "../lib/validators.js";
import { OwnerRequestModel } from "../models/ownerRequest.js";
import { PropertyModel } from "../models/property.js";
import { RequestModel } from "../models/propertyRequest.js";
import { UserModel } from "../models/user.js";

const updatableFields = [
  "username",
  "contactNumber",
  "name",
  "profilePicture",
  "legalVerificationID",
];

const userInfoKeys = "name username contactNumber profilePicture";
const propertyInfoKeys = "title rent status location propertyType";
export const createNewUser = async (name, email, password) => {
  name = validateName(name);
  email = validateEmail(email);

  if (!name || !email) {
    throw new ValidationError("Missing required values.");
  }
  const username = await generateUniqueUsername(name);

  const newUser = new UserModel({
    username,
    email,
    name,
    password,
  });

  await newUser.save();
  return [null, newUser];
};

export const updateUser = controllerWrapper(async (req, res) => {
  const user = req.user;
  const updates = req.body;

  updates.username = await validateUsername(updates.username, user);
  updates.legalVerificationID = await validateUserVerID(
    updates.legalVerificationID,
    user
  );
  updates.contactNumber = await validateContactNumber(
    updates.contactNumber,
    user
  );
  updates.name = validateName(updates.name);

  if (req.file) {
    deleteImage(user.profilePicture);
    updates.profilePicture = req.file.path;
  }

  updatableFields.forEach((key) => {
    if (updates[key] && updates[key] !== user[key]) {
      user[key] = updates[key];
    }
  });

  await user.save();

  user.legalVerificationID = getChoppedID(user.legalVerificationID);
  res
    .status(200)
    .json({ message: "User Details has been updated successfully", user });
});

export const changePassword = controllerWrapper(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError("Current and new passwords are required.");
  }

  const user = await UserModel.findById(req.user._id);
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ValidationError("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully." });
});

export const sendOwnerRequest = controllerWrapper(async (req, res) => {
  const user = req.user;

  if (!user.contactNumber) {
    throw new ValidationError("Contact number is required to send request.");
  }

  if (user.type !== "user") {
    throw new ValidationError("Please logout and login to see the changes.");
  }

  const existingRequest = await OwnerRequestModel.findOne({
    requesterId: user._id,
  }).sort({ timestamp: -1 });

  if (existingRequest?.status === "rejected") {
    if (calculateDays(existingRequest.timestamp) < 3) {
      throw new ValidationError(
        "You must wait at least 3 days after a rejection to send another request."
      );
    } else {
      await RequestModel.findByIdAndDelete(existingRequest._id);
    }
  }

  if (!existingRequest || existingRequest.status === "pending") {
    if (checkUserLegalVerID(user.legalVerificationID)) {
      user.type = "owner";
      await user.save();

      if (existingRequest) {
        await RequestModel.findByIdAndDelete(existingRequest._id);
      }

      return res.status(200).json({
        message: "User has been successfully upgraded to Owner.",
        userData: { type: user.type },
      });
    }

    if (existingRequest) {
      throw new ValidationError("You already have a pending request.");
    }
  }

  const newRequest = new OwnerRequestModel({
    requesterId: user._id,
  });

  await newRequest.save();

  return res.status(201).json({
    message: "Owner request has been successfully submitted.",
  });
});

export const sendPropertyRequest = controllerWrapper(async (req, res) => {
  const { propertyId } = req.params;

  const { age, gender, tenantType, noOfMonths, headCount, enterDate, message } =
    req.body;

  if (!propertyId || !mongoose.isValidObjectId(propertyId)) {
    throw new ValidationError("Invalid ID String.");
  }
  const property = await PropertyModel.findById(propertyId);

  if (!property || property.status !== "available") {
    throw new ValidationError("Property not exists.");
  }
  const requesterId = req.user._id;
  const listedBy = property.listedBy;

  if (String(requesterId) === String(listedBy)) {
    throw new ValidationError("You cannot request your own property.");
  }

  const existingRequest = await RequestModel.findOne({
    propertyId,
    requesterId,
    status: { $ne: "forgot" },
  });

  if (existingRequest) {
    throw new ValidationError(
      `Your previous request is ${existingRequest.status} can't send a new request.`
    );
  }

  const newRequest = new RequestModel({
    propertyId,
    requesterId,
    listedBy,
    details: {
      age,
      gender,
      tenantType,
      noOfMonths,
      headCount,
      enterDate,
    },
    status: "pending",
    lseen: false,
    rseen: true,
  });

  if (message) {
    newRequest.messages.push({
      user_id: requesterId,
      message,
      type: "txt",
    });
  }

  await newRequest.save();

  const receiver = getReceiverSocketId(listedBy);

  const savedRequest = await RequestModel.findById(newRequest._id);
  if (receiver) {
    io.to(receiver).emit("stateChange", {
      request: await savedRequest.populate({
        path: "requesterId",
        select: userInfoKeys,
      }),
    });
  }

  // blocking previous populate
  savedRequest.requesterId = req.user._id;
  return res.status(201).json({
    message: "Property request has been successfully created.",
    newRequest: await savedRequest.populate([
      {
        path: "propertyId",
        select: propertyInfoKeys,
      },
      { path: "listedBy", select: userInfoKeys },
    ]),
  });
});

export const getUserDetails = controllerWrapper(async (req, res) => {
  req.user.legalVerificationID = getChoppedID(req.user.legalVerificationID);

  return res.status(201).json({
    user: req.user,
    message: "User details fetched successfully",
  });
});

export const getUserRequests = controllerWrapper(async (req, res) => {
  const propertyPopulate = {
    path: "propertyId",
    select: propertyInfoKeys,
  };

  const baseProjection = {
    propertyId: 1,
    listedBy: 1,
    requesterId: 1,
    details: 1,
    status: 1,
    date: 1,
    updatedAt: 1,
    lseen: 1,
    rseen: 1,
    messages: {
      $cond: {
        if: { $gt: [{ $size: "$messages" }, 0] },
        then: [{ $arrayElemAt: ["$messages", -1] }],
        else: [],
      },
    },
  };

  let allRequests;

  const userRequests = RequestModel.find(
    { requesterId: req.user._id },
    baseProjection
  ).populate([propertyPopulate, { path: "listedBy", select: userInfoKeys }]);

  if (req.user.type !== "user") {
    const ownerRequests = RequestModel.find(
      { listedBy: req.user._id },
      baseProjection
    ).populate([
      //propertyPopulate,
      { path: "requesterId", select: userInfoKeys },
    ]);
    const [userRequestsResult, ownerRequestsResult] = await Promise.all([
      userRequests,
      ownerRequests,
    ]);

    allRequests = [...userRequestsResult, ...ownerRequestsResult];
  } else {
    allRequests = await userRequests;
  }

  const results = await Promise.all(
    allRequests.map(async (request) => {
      const isExpired = await request.checkExpirationAndDelete();
      return { request, isExpired };
    })
  );

  const safeRequests = results
    .filter((result) => !result.isExpired)
    .map((result) => result.request);

  res.status(200).json({ requests: safeRequests });
});

// to return some important infos
export const getRequestMessagesByID = controllerWrapper(async (req, res) => {
  const { requestId } = req.params;

  const userId = String(req.user._id);

  if (!requestId || !mongoose.isValidObjectId(requestId)) {
    throw new ValidationError("Invalid ID String.");
  }

  const request = await RequestModel.findById(requestId).populate({
    path: "propertyId",
    select: "rent",
  });

  if (!request) {
    throw new ValidationError("request doesn't exists");
  }

  const isRequester = String(request.requesterId._id) === userId;
  const isLister = String(request.listedBy) === userId;

  if (!(isRequester || isLister)) {
    throw new ValidationError("You are not authorized to view this request.");
  }
  res.status(200).json({
    messages: request.messages,
    rent: request.propertyId.rent,
  });
});

/*
 * Chat functions & Real time updating logic
 *
 */

export const sendMessage = controllerWrapper(async (req, res) => {
  const { requestId } = req.params;

  const { message } = req.body;
  const cleanedMsg = message.trim();

  if (!cleanedMsg) {
    throw new ValidationError("Can't send a empty message");
  }

  if (cleanedMsg.length > 250) {
    throw new ValidationError(
      "Minimum allowed character limit is 250 for a message."
    );
  }

  const request = await validateRequestAndUser(requestId, req.user);

  if (!["accepted", "finalized"].includes(request.status)) {
    throw new ValidationError("Can't send messages");
  }

  const newMessage = {
    user_id: req.user._id,
    type: "txt",
    message: cleanedMsg,
    timestamp: new Date(),
  };

  request.messages.push(newMessage);

  const isRequester = String(request.requesterId) === String(req.user._id);

  if (isRequester) {
    request.lseen = false;
  } else {
    request.rseen = false;
  }

  await request.save();

  const receiver = getReceiverSocketId(
    isRequester ? request.listedBy : request.requesterId
  );

  const updateData = {
    requestId,
    newMessage,
    rseen: request.rseen,
    lseen: request.lseen,
  };

  if (receiver) {
    io.to(receiver).emit("newMessage", updateData);
  }

  return res.status(200).json(updateData);
});

export const respondToAgreement = controllerWrapper(async (req, res) => {
  const { requestId } = req.params;
  const { aggId, upiId, pin, click } = req.body;

  let request;
  try {
    request = await RequestModel.findOne({
      _id: requestId,
      "messages.agreement._id": aggId,
    });
  } catch {
    throw new ValidationError("Invalid request/agreement ID");
  }

  if (!request) {
    throw new ValidationError("Request or agreement not found.");
  }

  if (String(request.requesterId) !== String(req.user._id)) {
    throw new ValidationError(
      "You are not authorized to respond to this agreement."
    );
  }

  if (request.status.startsWith("f")) {
    throw new ValidationError("Cannot respond to this agreement anymore.");
  }

  const message = request.messages.find(
    (msg) => msg.agreement && String(msg.agreement._id) === aggId
  );

  if (!message || !message.agreement || message.agreement.status !== "open") {
    throw new ValidationError("Can't respond to this agreement");
  }

  if (click === "reject") {
    message.agreement.status = "rejected";
    await request.save();
  } else if (click === "accept") {
    if (!checkUpiAndPin(upiId, pin)) {
      throw new ValidationError("Invalid UPI ID or PIN.");
    }

    message.agreement.status = "accepted";
    request.status = "finalized";

    const property = await PropertyModel.findById(request.propertyId).populate({
      path: "listedBy",
      select: "name contactNumber",
    });
    property.status = "occupied";
    property.releaseDate = new Date(message.agreement.endd);

    await property.save();

    request.messages.push({
      user_id: null,
      type: "con",
      message: `${aggId};+${new Date()};+${req.user.name};+${req.user._id};+${message.agreement.startd};+${message.agreement.endd};+${message.agreement.rent};+${property.title};+${property.propertyType};+${property.location.address};+${getChoppedID(property.legalDocumentId || "420***420")};+${property.listedBy.name};+${property.listedBy._id};+${property.listedBy.contactNumber}`,
      timestamp: new Date(),
    });
    request.rseen = false;
    request.lseen = false;

    await request.save();
  } else {
    throw new ValidationError("Invalid action specified.");
  }

  const receiver = getReceiverSocketId(request.listedBy);

  // to block unchanged keys from getting updated
  const updatedFields = {
    messages: request.messages,
    status: request.status,
    date: request.date,
    _id: request._id,
    rseen: request.rseen,
    lseen: request.lseen,
  };

  if (receiver) {
    io.to(receiver).emit("stateChange", { request: updatedFields });
  }

  res.status(200).json({ message: "Response saved", request: updatedFields });
});

// Seen status changer

export const changeSeenStatus = async (requestId, seenf, receiverId) => {
  const request = await RequestModel.findById(requestId);
  request[seenf] = true;

  await request.save();

  const receiver = getReceiverSocketId(receiverId);

  if (receiver) {
    io.to(receiver).emit("stateChange", {
      request: {
        _id: request._id,
        [seenf]: true,
      },
    });
  }
};
