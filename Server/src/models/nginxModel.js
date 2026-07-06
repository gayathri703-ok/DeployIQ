import mongoose from "mongoose";

const nginxSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
    },

    port: {
      type: Number,
      required: true,
    },

    config: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "NginxConfig",
  nginxSchema
);