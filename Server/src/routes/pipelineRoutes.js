import express from "express";

import {
  deployProject,
} from "../controllers/pipelineController.js";

import protect from "../middleware/authmiddleware.js";

const router =
  express.Router();

router.post(
  "/deploy/:projectId",
  protect,
  deployProject
);

export default router;