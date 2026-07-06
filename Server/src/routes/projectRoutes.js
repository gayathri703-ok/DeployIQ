// ============================================
// Project Routes
// ============================================

import express from "express";

import {
  getProjects,
  getProjectById,
  createProject,
  deleteProject
} from "../controllers/projectController.js";

const router = express.Router();

// Get All Projects
router.get("/", getProjects);

// Get Single Project
router.get("/:id", getProjectById);

// Create Project
router.post("/", createProject);

// Delete Project
router.delete("/:id", deleteProject);

export default router;