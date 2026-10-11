import express from "express";
import multer from "multer";
import protect from "../middleware/auth.middleware.js";
import { uploadImage } from "../controllers/media.controller.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, callback) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
                new Error("Only JPEG, PNG, and WebP images are allowed.")
            );
        }

        callback(null, true);
    },
});

router.post("/upload", protect, upload.single("image"), uploadImage);

export default router;