// ============================================
// DAY 3 — Authentication Controller
// Register / Login / Logout / JWT
// ============================================

import jwt from "jsonwebtoken";

import User from "../models/user.js";  // ✅ correct

// ============================================
// Generate JWT
// ============================================

const generateToken = (userId) => {

  return jwt.sign(

    { id: userId },

    process.env.JWT_SECRET,

    {
      expiresIn:
        process.env.JWT_EXPIRE || "7d"
    }

  );

};

// ============================================
// Register
// POST /api/auth/register
// ============================================

const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "All fields are required"

      });

    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(409).json({

        success: false,

        message:
          "Email already registered"

      });

    }

    const user =
      await User.create({

        name,
        email,
        password

      });

    const token =
      generateToken(user._id);

    res.status(201).json({

      success: true,

      message:
        "Account created successfully",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        githubConnected:
          user.githubConnected

      }

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ============================================
// Login
// POST /api/auth/login
// ============================================

const login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email and password are required"

      });

    }

    const user =
      await User.findOne({ email })
        .select("+password");

    if (!user) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid credentials"

      });

    }

    const isMatch =
      await user.comparePassword(password);

    if (!isMatch) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid credentials"

      });

    }

    user.lastLogin =
      new Date();

    await user.save({
      validateBeforeSave: false
    });

    const token =
      generateToken(user._id);

    res.status(200).json({

      success: true,

      message:
        "Login successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        githubConnected:
          user.githubConnected,

        githubUsername:
          user.githubUsername

      }

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ============================================
// Get Current User
// GET /api/auth/me
// ============================================

const getMe = async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.id
      );

    res.status(200).json({

      success: true,

      user

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ============================================
// Logout
// POST /api/auth/logout
// ============================================

const logout = (req, res) => {

  res.status(200).json({

    success: true,

    message:
      "Logged out successfully"

  });

};

// ============================================
// Exports
// ============================================

export {
  register,
  login,
  getMe,
  logout
};