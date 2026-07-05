// server/src/routes/adminRoutes.js

import express from "express";

import {
  getAdminSummary,
  getAllUsers,
  getAllProjects,
} from "../controllers/adminController.js";

const router = express.Router();

// Single summary endpoint — frontend uses this
router.get("/summary",  getAdminSummary);

// Individual endpoints
router.get("/users",    getAllUsers);
router.get("/projects", getAllProjects);

export default router;