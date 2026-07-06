// ============================================
// GitHub Routes
// ============================================

import express from "express";

import protect from "../middleware/authmiddleware.js";

import {

  connectGitHub,

  githubCallback,

  getRepositories,

  disconnectGitHub

} from "../controllers/githubController.js";

const router =
  express.Router();

// ============================================
// Routes
// ============================================

router.get(
  "/connect",
  protect,
  connectGitHub
);

router.get(
  "/callback",
  githubCallback
);

router.get(
  "/repos",
  protect,
  getRepositories
);

router.delete(
  "/disconnect",
  protect,
  disconnectGitHub
);

// ============================================
// Export
// ============================================

export default router;