import express from "express";

import { loginUser, logoutUser, registerUser } from "../controllers/auth.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("Auth way");
});

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", authMiddleware(), logoutUser);
export const AuthRoute = router;
