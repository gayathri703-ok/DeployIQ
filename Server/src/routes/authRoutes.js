// ============================================
// authRoutes.js
// ============================================

import express from "express";

const router = express.Router();

// Controllers
import {
  register,
  login,
  logout,
  getMe
} from "../controllers/authController.js";

// Middleware
import protect from "../middleware/authmiddleware.js";

// ============================================
// Auth Routes
// ============================================

// Register User
router.post(
  "/register",
  register
);

// Login User
router.post(
  "/login",
  login
);

// Logout User
router.post(
  "/logout",
  protect,
  logout
);

// Get Current User
router.get(
  "/me",
  protect,
  getMe
);

export default router;