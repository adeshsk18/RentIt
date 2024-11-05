import mongoose from "mongoose";

import { calculateDays } from "../lib/utils.js";

const { Schema } = mongoose;

const aggSchema = new Schema({
  startd: {
    type: Date,
    required: true,
  },
  endd: {
    type: Date,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "rejected", "accepted"],
    default: "open",
  },
});

const messageSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, default: null, ref: "User" },
    type: { type: String, enum: ["txt", "agg", "con"], default: "txt" },
    message: { type: String, default: "" },
    agreement: {
      type: aggSchema,
      default: null,
    },

    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const detailsSchema = new Schema(
  {
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    tenantType: {
      type: String,
      enum: ["family", "couples", "bachelors", "students", "group"],
      required: true,
    },
    noOfMonths: {
      type: Number,
      required: true,
    },
    headCount: {
      type: Number,
    },
    enterDate: {
      type: Date,
    },
  },
  { _id: false }
);

const requestSchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Property",
    },

    listedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    requesterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    details: {
      type: detailsSchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "finalized", "forgot"],
      default: "pending",
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    date: {
      type: Date,
      default: Date.now,
    },
    lseen: {
      type: Boolean,
      required: true,
    },
    rseen: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const terminalStates = ["rejected", "finalized", "forgot"];
const removeStates = ["rejected", "forgot"];

requestSchema.pre("save", function (next) {
  if (this.isModified("status") && terminalStates.includes(this.status)) {
    this.date = Date.now();
  }

  next();
});

// Kill Your Self
requestSchema.methods.checkExpirationAndDelete = async function () {
  if (!removeStates.includes(this.status)) {
    return false;
  }
  const daysDifference = calculateDays(new Date(this.date));

  if (daysDifference >= 2) {
    await RequestModel.deleteOne({ _id: this._id });
    return true;
  }
  return false;
};

export const RequestModel = mongoose.model("Request", requestSchema);
