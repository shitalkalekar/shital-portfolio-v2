import protect from "../middleware/auth.middleware.js";
import express from "express";

import {
  createEducation,
  getEducations,
  getEducationById,
  updateEducation,
  deleteEducation,
} from "../controllers/education.controller.js";

const router = express.Router();

router.post("/", protect, createEducation);
router.get("/", getEducations);
router.get("/:id", getEducationById);
router.put("/:id", protect, updateEducation);
router.delete("/:id", protect, deleteEducation);

export default router;