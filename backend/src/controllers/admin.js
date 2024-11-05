import ValidationError from "../lib/errors.js";
import { controllerWrapper } from "../lib/utils.js";
import { OwnerRequestModel } from "../models/ownerRequest.js";
import { PropertyModel } from "../models/property.js";
import { UserModel } from "../models/user.js";

export const approveProperty = controllerWrapper(async (req, res) => {
  const { propertyId } = req.params;
  const { flag } = req.body;

  if (!propertyId) {
    return res.status(400).json({ message: "Property ID is required." });
  }

  const property = await PropertyModel.findById(propertyId);

  if (!property) {
    return res.status(400).json({ message: "Property not found." });
  }
  let message = "Property status not changed";
  if (flag === "accept") {
    property.isApproved = true;
    property.status = "available";
    message = "Property approved successfully";
  } else {
    property.isApproved = false;
    property.status = "rejected";
    message = "Property rejected successfully.";
  }

  await property.save();

  return res.status(200).json({ message });
});

export const respondToRequest = controllerWrapper(async (req, res) => {
  const { requestId } = req.params;
  const { flag } = req.body;

  const request = await OwnerRequestModel.findById(requestId);

  if (!request) {
    return res.status(400).json({ message: "Request not found." });
  }

  const user = await UserModel.findById(request.requesterId);

  if (!user) {
    throw new ValidationError("User not found");
  }

  if (user.contactNumber === null) {
    return res.status(400).json({ message: "Contact number not found." });
  }

  let message = "No Action";

  if (flag === "accept") {
    user.type = "owner";
    await user.save();

    await OwnerRequestModel.deleteOne({ _id: request._id });
    message = "User approved successfully";
  } else {
    request.status = "rejected";
    await request.save();
    message = "Request rejected successfully";
  }

  return res.status(200).json({ message });
});

export const getAllUnApprovedProperty = controllerWrapper(async (_, res) => {
  const unApprovedProperties = await PropertyModel.find({
    isApproved: false,
    status: "waiting",
  });
  res.status(200).json(unApprovedProperties);
});

export const getAllPendingOwnerRequests = controllerWrapper(async (_, res) => {
  const pendingRequests = await OwnerRequestModel.find({ status: "pending" })
    .populate("requesterId", "name email contactNumber username profilePicture")
    .exec();

  res.status(200).json(pendingRequests);
});
