import express from "express";

import {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Public — visitors can submit contact forms
router.post("/", createMessage);

// Admin only — read/manage messages
router.get("/", protect, getMessages);
router.get("/:id", protect, getMessageById);
router.put("/:id", protect, updateMessage);
router.delete("/:id", protect, deleteMessage);

export default router;