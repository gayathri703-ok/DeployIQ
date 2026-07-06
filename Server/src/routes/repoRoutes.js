import express from "express";

import protect from "../middleware/authmiddleware.js";

import {
  cloneRepo
} from "../controllers/dockerController.js";

const router = express.Router();

// ============================================
// Clone Repository
// ============================================

router.post(
  "/clone",
  protect,
  cloneRepo
);

export default router;