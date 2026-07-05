// ============================================
// Project Model
// ============================================

import mongoose from "mongoose";

// ============================================
// Project Schema
// ============================================

const projectSchema =
  new mongoose.Schema(

    {

      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

      },

      name: {

        type: String,

        required: true

      },

      repoName: {

        type: String,

        required: true

      },

      repoUrl: {

        type: String,

        required: true

      },

      branch: {

        type: String,

        default: "main"

      },

      framework: {

        type: String,

        default: "node"

      },

      status: {

        type: String,

        enum: [

          "idle",

          "building",

          "live",

          "failed"

        ],

        default: "idle"

      },

      deployedUrl: {

        type: String

      },

      containerId: {

        type: String

      },

      containerName: {

        type: String

      },

      port: {

        type: Number

      }

    },

    {

      timestamps: true

    }

  );

// ============================================
// Export Model
// ============================================

const Project =
  mongoose.models.Project ||
  mongoose.model(
    "Project",
    projectSchema
  );

export default Project;