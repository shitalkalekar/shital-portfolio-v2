import protect from "../middleware/auth.middleware.js";
import express from "express";

import {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} from "../controllers/experience.controller.js";

const router = express.Router();

router.post("/", protect, createExperience);

router.get("/", getExperiences);

router.get("/:id", getExperienceById);

router.put("/:id", protect, updateExperience);

router.delete("/:id", protect, deleteExperience);

export default router;