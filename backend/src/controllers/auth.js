import ValidationError from "../lib/errors.js";
import { controllerWrapper } from "../lib/utils.js";
import { UserModel } from "../models/user.js";
import { createNewUser } from "./user.js";
import jwt from "jsonwebtoken";

export const registerUser = controllerWrapper(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new ValidationError(
      "Account already exists for the given email address, please use a different email address."
    );
  }

  const [err, newUser] = await createNewUser(name, email, password);

  if (err) {
    return res.status(400).json({
      message: err,
    });
  }

  res.status(200).json({
    message: "User registered successfully",
    token: newUser.getJWTToken(),
    userData: {
      uid: newUser._id,
      type: newUser.type,
    },
  });
});

export const loginUser = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res.status(200).json({
      message: "User Loged in.",
      token: user.getJWTToken(),
      userData: {
        uid: user._id,
        type: user.type,
        name: user.name
      },
    });
  } else {
    throw new ValidationError("Invalid Credentials");
  }
});

export const logoutUser = controllerWrapper(async (_, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully." });
});

export const forgotPassword = controllerWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ValidationError("No user found with this email address");
  }

  // Generate reset token that expires in 15 minutes
  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Generate reset link
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  res.status(200).json({
    message: "Password reset link generated successfully",
    resetLink,
  });
});

export const verifyEmail = controllerWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ValidationError("No user found with this email address");
  }

  res.status(200).json({
    message: "Email verified successfully",
  });
});

export const resetPassword = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ValidationError("User not found");
  }

  // Update password
  user.password = password;
  await user.save();

  res.status(200).json({
    message: "Password reset successful",
  });
});

export const verifyResetToken = controllerWrapper(async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new ValidationError("User not found");
    }

    res.status(200).json({
      message: "Token is valid",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ValidationError("Password reset link has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ValidationError("Invalid reset link");
    }
    throw error;
  }
});
