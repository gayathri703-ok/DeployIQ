// server/src/routes/monitoringRoutes.js

import express from "express";

import {
  getSystemStats,
  getContainerStatus,
  getMonitoringSummary,
} from "../controllers/monitoringController.js";

const router = express.Router();

// Full summary — frontend uses this
router.get("/summary", getMonitoringSummary);

// Individual endpoints
router.get("/system",     getSystemStats);
router.get("/containers", getContainerStatus);

export default router;