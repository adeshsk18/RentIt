import { request } from "express";
import mongoose from "mongoose";

import { availablePropertyTypes } from "../config/constants.js";
import { getReceiverSocketId, io } from "../config/socket.js";
import getGeocordinates from "../lib/geocode.js";
import { checkPropertyLegalDocID } from "../lib/utils.js";
import { RequestModel, terminalStates } from "./propertyRequest.js";

const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },

    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  { _id: false }
);

locationSchema.pre("save", async function (next) {
  if (this.isModified("address")) {
    try {
      const [cords, _] = await getGeocordinates(this.address);

      this.coordinates = [cords.lon, cords.lat];
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const propertySchema = new Schema(
  {
    location: {
      type: locationSchema,
      required: true,
    },

    title: { type: String, required: true },

    description: {
      type: String,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
    },

    propertyType: {
      type: String,
      required: true,
      enum: availablePropertyTypes,
    },

    numberOfBedrooms: {
      type: Number,
      required: true,
      min: 0,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    listedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    legalDocumentId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["unlisted", "occupied", "available", "waiting", "rejected"],
    },

    releaseDate: {
      type: Date,
      default: null,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const blockStates = ["occupied", "unlisted"];

async function updateRequests(propertyId) {
  const requests = await RequestModel.find({
    propertyId,
    status: { $nin: terminalStates },
  });

  const lister =
    requests.length > 0 ? getReceiverSocketId(requests[0].listedBy) : null;

  for (const request of requests) {
    request.status = "forgot";
    await request.save();

    const requester = getReceiverSocketId(request.requesterId);
    const updatedFields = {
      messages: request.messages,
      status: request.status,
      date: request.date,
      _id: request._id,
    };

    if (requester) {
      io.to(requester).emit("stateChange", { request: updatedFields });
    }
    if (lister) {
      io.to(lister).emit("stateChange", { request: updatedFields });
    }
  }
}

propertySchema.pre("save", async function (next) {
  if (
    this.isModified("location.address") ||
    this.isModified("rent") ||
    this.isModified("propertyType") ||
    this.isModified("numberOfBedrooms")
  ) {
    this.isApproved = false;
    this.status = "waiting";
  }

  if (!this.isApproved) {
    this.isApproved = checkPropertyLegalDocID(this.legalDocumentId);
    this.status = this.isApproved ? "available" : this.status;
  }

  if (this.isModified("status")) {
    // Block all old requests
    await updateRequests(this._id);
  }

  next();
});

propertySchema.pre("deleteOne", async function (next) {
  try {
    await updateRequests(this._id);
    next();
  } catch (error) {
    next(error);
  }
});

export const PropertyModel = mongoose.model("Property", propertySchema);
