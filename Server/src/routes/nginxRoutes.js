import express from "express";

import {
  generateConfig,
  getConfigs,
  deleteConfig,
} from "../controllers/nginxController.js";

const router = express.Router();

router.post(
  "/generate",
  generateConfig
);

router.get(
  "/",
  getConfigs
);

router.delete(
  "/:id",
  deleteConfig
);

export default router;