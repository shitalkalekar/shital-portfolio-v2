import protect from "../middleware/auth.middleware.js";
import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
   deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", protect, createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;