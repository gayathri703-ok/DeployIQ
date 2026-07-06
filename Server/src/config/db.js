// ============================================
// DAY 2 — MongoDB Setup & Connection
// ============================================

import mongoose from "mongoose";

// ============================================
// Connect MongoDB
// ============================================

const connectDB = async () => {

  try {

    const conn =
      await mongoose.connect(
        process.env.MONGO_URI
      );

    console.log(
      `✅ MongoDB connected: ${conn.connection.host}`
    );

  } catch (error) {

    console.error(
      `❌ MongoDB connection failed: ${error.message}`
    );

    process.exit(1);

  }

};

// ============================================
// MongoDB Events
// ============================================

mongoose.connection.on(
  "disconnected",

  () => {

    console.warn(
      "⚠️ MongoDB disconnected"
    );

  }
);

mongoose.connection.on(
  "reconnected",

  () => {

    console.log(
      "♻️ MongoDB reconnected"
    );

  }
);

// ============================================
// Export
// ============================================

export default connectDB;