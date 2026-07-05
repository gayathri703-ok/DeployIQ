import express from "express";

import {
  getDeploymentLogs,
  streamLogs
} from "../controllers/logController.js";

const router = express.Router();

// Get deployment logs
router.get(
  "/:deploymentId",
  getDeploymentLogs
);

// Stream logs
router.get(
  "/:deploymentId/stream",
  streamLogs
);

export default router;