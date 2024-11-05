import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  approveProperty,
  getAllPendingOwnerRequests,
  getAllUnApprovedProperty,
  respondToRequest,
} from "../controllers/admin.js";

const router = express.Router();
const routerProtection = authMiddleware("admin");

router.get("/", routerProtection, (_, res) =>
  res.send("Protected Admin API Route"),
);

router.put("/preq/:propertyId", routerProtection, approveProperty);
router.put("/oreq/:requestId", routerProtection, respondToRequest);

router.get("/preq", routerProtection, getAllUnApprovedProperty);
router.get("/oreq", routerProtection, getAllPendingOwnerRequests);

export const AdminRoute = router;
