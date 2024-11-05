import express from "express";

import upload from "../config/cloudinaryConf.js";
// multerConf.js";
import {
  changePassword,
  getRequestMessagesByID,
  getUserDetails,
  getUserRequests,
  respondToAgreement,
  sendMessage,
  sendOwnerRequest,
  sendPropertyRequest,
  updateUser,
} from "../controllers/user.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();
const routeProtection = authMiddleware();

router.get("/", routeProtection, (_, res) =>
  res.send("Protected User API Route")
);

router
  .route("/profile")
  .put(routeProtection, upload.single("profilePicture"), updateUser)
  .get(routeProtection, getUserDetails);

router.put("/profile/password", routeProtection, changePassword);

router.post("/orequest", routeProtection, sendOwnerRequest);

router.post("/prequest/:propertyId", routeProtection, sendPropertyRequest);
router.get("/prequest", routeProtection, getUserRequests);

router.get("/prequest/:requestId", routeProtection, getRequestMessagesByID);

router.post("/message/:requestId", routeProtection, sendMessage);
router.post("/respond/:requestId", routeProtection, respondToAgreement);

export const UserRoute = router;
