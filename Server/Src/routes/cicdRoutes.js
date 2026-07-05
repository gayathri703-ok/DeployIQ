import express from "express";

import protect from "../middleware/authmiddleware.js";

import {
  getCICDStats,
} from "../controllers/cicdController.js";

const router = express.Router();

router.get(
  "/stats",
  protect,
  getCICDStats
);

export default router;