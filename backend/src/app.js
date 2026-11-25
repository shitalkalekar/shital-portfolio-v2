import express from "express";
import cors from "cors";

import profileRoutes from "./routes/profile.routes.js";
import projectRoutes from "./routes/project.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import educationRoutes from "./routes/education.routes.js";
import certificationRoutes from "./routes/certification.routes.js";
import messageRoutes from "./routes/message.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import mediaRoutes from "./routes/media.routes.js";

const app = express();

const defaultAllowedOrigins = [
  "https://shital-portfolio-v2.vercel.app",
  "http://localhost:5173",
];

const parseAllowedOrigins = (value) =>
  (value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

const configuredOrigins = parseAllowedOrigins(process.env.CORS_ORIGIN);
const allowedOrigins =
  configuredOrigins.length > 0 ? configuredOrigins : defaultAllowedOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header (curl, health checks, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.trim().replace(/\/+$/, "");
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS and preflight handling before all routes
app.use(cors(corsOptions));
app.options("/{*splat}", cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Shital Portfolio API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "OK",
  });
});

app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;