// server/src/routes/deploymentRoutes.js

import express from "express";

import {
  createDeployment,
  getDeployments,
  getDeployment,
  deleteDeployment,
  rollback,
  getQueueStatus,   // ✅ new
} from "../controllers/deploymentController.js";

const router = express.Router();

// TEMPORARY: auth disabled

router.post("/",              createDeployment);
router.get("/",               getDeployments);
router.get("/queue",          getQueueStatus);    // ✅ new — must be before /:id
router.get("/:id",            getDeployment);
router.delete("/:id",         deleteDeployment);
router.post("/:id/rollback",  rollback);

export default router;