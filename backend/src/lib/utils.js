import { v2 as cloudinary } from "cloudinary";
//import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { UserModel } from "../models/user.js";
import ValidationError from "./errors.js";

function getRandomChar() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

export const generateUniqueUsername = async (name) => {
  const randn = Math.floor(Math.random() * 90) + 10;

  const basename = name
    .slice(0, 5)
    .toLowerCase()
    .replace(/ /g, getRandomChar());

  let username = `${basename}${randn}`;
  let count = 1;

  while (await UserModel.findOne({ username })) {
    username = `${basename}${randn + count}`;
    count++;
  }

  return username;
};

export const controllerWrapper = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        if (process.env.DEV_MODE) {
          console.log(err);
        }
        res.status(500).json({ message: "Server Error" });
      }
    }
  };
};
const denomD = 86400000; // 1000 * 60 * 60 * 24
export function calculateDays(timestamp) {
  const now = new Date();
  const daySince = (now - timestamp) / denomD;

  return daySince;
}

const __filename = fileURLToPath(import.meta.url);
export const root_directory = path.join(path.dirname(__filename), "../../");

// for local multer storage
//export const deleteImage = (imagePath) => {
//  if (!imagePath) {
//    return;
//  }
//  const fullPath = path.join(root_directory, imagePath);
//  try {
//    fs.unlinkSync(fullPath);
//    if (process.env.DEV_MODE) {
//      console.log(`Successfully deleted image: ${fullPath}`);
//    }
//  } catch (err) {
//    if (process.env.DEV_MODE) {
//      console.error(`Error deleting image: ${fullPath}`, err);
//    }
//  }
//};

export const deleteImage = (imageUrl) => {
  if (!imageUrl) {
    return;
  }

  try {
    const splitUrl = imageUrl.split("/");
    const publicIdWithExtension = splitUrl[splitUrl.length - 1];
    const folder = splitUrl[splitUrl.length - 2];
    const publicId = `${folder}/${publicIdWithExtension.split(".")[0]}`;

    const result = cloudinary.uploader.destroy(publicId, { sync: true });

    if (process.env.DEV_MODE) {
      console.log(`Successfully deleted image: ${publicId}`);
    }

    return result;
  } catch (err) {
    if (process.env.DEV_MODE) {
      console.error(`Error deleting image from Cloudinary:`, err);
    }
  }
};

export function checkPropertyLegalDocID(legaldocId) {
  if (legaldocId === null) {
    return false;
  }

  return (
    legaldocId.slice(process.env.LEGD_SI, process.env.LEGD_EI) ===
    process.env.SECRET_PHRASE1
  );
}

export function checkUserLegalVerID(legalverId) {
  if (!legalverId) {
    return false;
  }

  return (
    legalverId.slice(process.env.LEGV_SI, process.env.LEGV_EI) ===
    process.env.SECRET_PHRASE2
  );
}

export function checkUpiAndPin(upiId, pin) {
  if (!upiId || !pin) {
    return false;
  }

  if (!upiId.includes("@") || upiId.length < 8) {
    return false;
  }

  const pinStr = pin.toString();

  if (pinStr.length !== 12) {
    return false;
  }

  let sum = 0;
  for (const char of pinStr) {
    const digit = parseInt(char);

    if (digit < 5 || digit % 2 === 0) {
      return false;
    }

    sum += digit;
  }

  return sum % parseInt(process.env.SECRET_VAL) === 0;
}

export const getChoppedID = (id_string) => {
  if (!id_string) {
    return null;
  }

  return `${id_string.slice(0, 3)}***${id_string.slice(id_string.length - 3)}`;
};

export const getReceiverId = (request, userID) => {
  return String(request.requesterId) === String(userID)
    ? String(request.listedBy)
    : String(request.requesterId);
};
