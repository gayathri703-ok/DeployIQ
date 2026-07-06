// ============================================
// DAY 3 — JWT Auth Middleware
// ============================================

import jwt from "jsonwebtoken";

import User from "../models/user.js";

// ============================================
// Protect Middleware
// ============================================

const protect = async (
  req,
  res,
  next
) => {
  console.log("AUTH HEADER:", req.headers.authorization);

  try {

    const authHeader =
      req.headers.authorization;

    // ========================================
    // Check Token Exists
    // ========================================

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Not authorized — no token"

      });

    }

    // ========================================
    // Extract Token
    // ========================================

    const token =
      authHeader.split(" ")[1];

    // ========================================
    // Verify Token
    // ========================================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // ========================================
    // Find User
    // ========================================

    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    if (!user) {

      return res.status(401).json({

        success: false,

        message:
          "User no longer exists"

      });

    }

    // ========================================
    // Attach User To Request
    // ========================================

    req.user = user;

    next();

  } catch (error) {

    // ========================================
    // Token Expired
    // ========================================

    if (
      error.name ===
      "TokenExpiredError"
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Token expired"

      });

    }

    // ========================================
    // Invalid Token
    // ========================================

    return res.status(401).json({

      success: false,

      message:
        "Invalid token"

    });

  }

};

// ============================================
// Export Middleware
// ============================================

export default protect;