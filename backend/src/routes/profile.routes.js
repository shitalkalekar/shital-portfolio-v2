import protect from "../middleware/auth.middleware.js";
import express from "express";

import {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", getProfile);

router.post("/", protect, createProfile);
router.put("/", protect, updateProfile);
router.delete("/", protect, deleteProfile);

export default router;