import ValidationError from "../lib/errors.js";
import { controllerWrapper } from "../lib/utils.js";
import { UserModel } from "../models/user.js";
import { createNewUser } from "./user.js";

export const registerUser = controllerWrapper(async (req, res) => {
  const { name, email, password, passphrase } = req.body;

  if (passphrase.toUpperCase() !== process.env.REGISTER_PASSPHRASE) {
    throw new ValidationError("Provided Pass Phrase is Invalid.");
  }
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
