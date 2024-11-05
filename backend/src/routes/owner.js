import express from "express";

import upload from "../config/cloudinaryConf.js";
// multerConf.js";
import {
  addProperty,
  changePropertyStatus,
  deleteProperty,
  getAllProperties,
  getPropertyDetails,
  respondeToRequest,
  sendAgreement,
  updateProperty,
} from "../controllers/owner.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();
const routeProtection = authMiddleware("owner", "admin");

const uploadImages = upload.array("images", 10);

router.get("/", routeProtection, (_, res) =>
  res.send("Protected Owner API Route")
);

router
  .route("/property")
  .post(routeProtection, uploadImages, addProperty)
  .get(routeProtection, getAllProperties);

router
  .route("/property/:propertyId")
  .put(routeProtection, uploadImages, updateProperty)
  .get(routeProtection, getPropertyDetails)
  .delete(routeProtection, deleteProperty);

router.put(
  "/property/status/:propertyId",
  routeProtection,
  changePropertyStatus
);

//router.get("/requests/:propertyId", routeProtection, getPropertyRequests);

router.post("/agreement/:requestId", routeProtection, sendAgreement);
router.post("/respond/:requestId", routeProtection, respondeToRequest);

export const OwnerRoute = router;
