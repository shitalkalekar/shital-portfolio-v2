import protect from "../middleware/auth.middleware.js";
import express from "express";

import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";

const router = express.Router();

router.post("/", protect, createSkill);


router.get("/", getSkills);

router.get("/:id",getSkillById );

router.put("/:id", protect, updateSkill);

router.delete("/:id", protect, deleteSkill);

export default router;