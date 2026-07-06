// server/src/models/deployment.js

import mongoose from "mongoose";

const deploymentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "queued",       // ✅ waiting in queue
        "running",      // ✅ currently deploying
        "building",
        "success",
        "failed",
        "rolled_back",
      ],
      default: "pending",
    },

    queuePosition: {
      type: Number,
      default: 0,       // 0 = running, 1+ = waiting
    },

    logs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Deployment =
  mongoose.models.Deployment ||
  mongoose.model("Deployment", deploymentSchema);

export default Deployment;