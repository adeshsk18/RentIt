import express from "express";

import {
  getFilteredProperties,
  getPropertyById,
  getPublicUserDetails,
} from "../controllers/listing.js";

const router = express.Router();

router.get("/", (_, res) => res.send("Open Listing Query Route"));

router.get("/filter", getFilteredProperties);
router.get("/:propertyId", getPropertyById);
router.get("/u/:username", getPublicUserDetails);

export const ListingsRoute = router;
