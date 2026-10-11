import protect from "../middleware/auth.middleware.js";
import express from "express";

import {
  createCertification,
  getCertifications,
  getCertificationById ,
  updateCertification,
  deleteCertification,
} from "../controllers/certification.controller.js";

const router = express.Router();

router.post("/", protect, createCertification);
router.get("/", getCertifications);
router.get("/:id", getCertificationById);
router.put("/:id", protect, updateCertification);
router.delete("/:id", protect, deleteCertification);

export default router;