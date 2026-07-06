import mongoose from "mongoose";

const envVarSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    key: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const EnvVar = mongoose.model(
  "EnvVar",
  envVarSchema
);

export default EnvVar;