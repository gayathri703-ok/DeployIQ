import express from "express";

import {
  createEnvVar,
  getEnvVars,
  deleteEnvVar,
} from "../controllers/envVarController.js";

const router = express.Router();

// ======================================
// Create Environment Variable
// POST /api/env
// ======================================

router.post("/", createEnvVar);

// ======================================
// Get Environment Variables By Project
// GET /api/env/:projectId
// ======================================

router.get("/:projectId", getEnvVars);

// ======================================
// Delete Environment Variable
// DELETE /api/env/:id
// ======================================

router.delete("/:id", deleteEnvVar);

export default router;