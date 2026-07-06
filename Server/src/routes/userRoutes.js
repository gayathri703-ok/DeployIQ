import express from "express";

import protect from "../middleware/authmiddleware.js";

const router = express.Router();

// ============================================
// Get Current User
// ============================================

router.get(
  "/profile",
  protect,
  async (req, res) => {

    res.json({
      success: true,
      user: req.user
    });

  }
);

export default router;