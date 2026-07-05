import express from "express";
import {
  rollbackDeployment,
} from "../controllers/rollbackController.js";

const router = express.Router();

router.post(
  "/:deploymentId",
  rollbackDeployment
);

export default router;