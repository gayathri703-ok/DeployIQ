import mongoose from "mongoose";

const domainSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
    },

    nginxConfig: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Domain = mongoose.model(
  "Domain",
  domainSchema
);

export default Domain;