// ============================================
// DeployIQ Backend Server
// ============================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { createServer } from "http";
import { Server } from "socket.io";

// ============================================
// Config
// ============================================

import connectDB from "./src/config/db.js";

// ============================================
// Routes
// ============================================

import authRoutes       from "./src/routes/authRoutes.js";
import userRoutes       from "./src/routes/userRoutes.js";
import githubRoutes     from "./src/routes/githubRoutes.js";
import repoRoutes       from "./src/routes/repoRoutes.js";
import dockerRoutes     from "./src/routes/dockerRoutes.js";
import projectRoutes    from "./src/routes/projectRoutes.js";
import deployRoutes     from "./src/routes/deploymentRoutes.js";
import logRoutes        from "./src/routes/logRoutes.js";
import envVarRoutes     from "./src/routes/envVarRoutes.js";
import nginxRoutes      from "./src/routes/nginxRoutes.js";
import analyticsRoutes  from "./src/routes/analyticsRoutes.js";
import domainRoutes     from "./src/routes/domainRoutes.js";
import rollbackRoutes   from "./src/routes/rollbackRoutes.js";
import pipelineRoutes   from "./src/routes/pipelineRoutes.js";
import cicdRoutes       from "./src/routes/cicdRoutes.js";
import monitoringRoutes from "./src/routes/monitoringRoutes.js";
import adminRoutes      from "./src/routes/adminRoutes.js";

// ============================================
// Middleware
// ============================================

import errorHandler from "./src/middleware/errorHandler.js";
import rateLimiter  from "./src/middleware/rateLimitermiddleware.js";

// ============================================
// Environment Config
// ============================================

dotenv.config();

// ============================================
// CORS Options — allows all Vercel URLs
// ============================================

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://deploy-iq-mjm7.vercel.app",
    ];

    // Allow any vercel.app preview URL or localhost
    if (
      allowedOrigins.includes(origin) ||
      origin.includes("vercel.app") ||
      origin.includes("localhost")
    ) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ============================================
// App Init
// ============================================

const app = express();
app.set("trust proxy", 1);

const httpServer = createServer(app);

// ============================================
// Socket.IO Setup — allows all Vercel URLs
// ============================================

const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes("vercel.app") ||
        origin.includes("localhost")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

// ============================================
// Socket Events
// ============================================

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("join-deployment", (deploymentId) => {
    socket.join(`deployment-${deploymentId}`);
    console.log(`Socket joined deployment-${deploymentId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// ============================================
// Global Middleware
// ============================================

app.use(helmet());
app.use(cors(corsOptions));          // ✅ updated CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(rateLimiter);

// ============================================
// API Routes
// ============================================

app.use("/api/auth",       authRoutes);
app.use("/api/users",      userRoutes);
app.use("/api/github",     githubRoutes);
app.use("/api/repos",      repoRoutes);
app.use("/api/docker",     dockerRoutes);
app.use("/api/projects",   projectRoutes);
app.use("/api/deployments",deployRoutes);
app.use("/api/logs",       logRoutes);
app.use("/api/env",        envVarRoutes);
app.use("/api/nginx",      nginxRoutes);
app.use("/api/analytics",  analyticsRoutes);
app.use("/api/domains",    domainRoutes);
app.use("/api/pipeline",   pipelineRoutes);
app.use("/api/cicd",       cicdRoutes);
app.use("/api/rollback",   rollbackRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/admin",      adminRoutes);

// ============================================
// Root Route
// ============================================

app.get("/", (req, res) => {
  res.json({ success: true, message: "🚀 DeployIQ Backend Running" });
});

// ============================================
// Health Check Route
// ============================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Error Handler Middleware
// ============================================

app.use(errorHandler);

// ============================================
// Start Server
// ============================================

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`
🚀 DeployIQ Server Running

🌐 URL:
http://localhost:${PORT}

📡 Socket.IO Active

🌿 Environment:
${process.env.NODE_ENV || "development"}
      `);
    });
  })
  .catch((error) => {
    console.log("❌ Database Connection Failed");
    console.log(error);
  });