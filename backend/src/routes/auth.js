import express from "express";

import { loginUser, logoutUser, registerUser, verifyEmail, resetPassword, verifyAdmin } from "../controllers/auth.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("Auth way");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware(), logoutUser);
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/verify-admin", verifyAdmin);

export const AuthRoute = router;
