import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { checkUserLegalVerID } from "../lib/utils.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    contactNumber: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      required: true,
      minlength: 5,
    },

    type: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: null,
    },

    legalVerificationID: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified("legalVerificationID")) {
    this.legalVerificationID = checkUserLegalVerID(this.legalVerificationID)
      ? this.legalVerificationID
      : null;
  }

  next();
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = mongoose.model("User", userSchema);
