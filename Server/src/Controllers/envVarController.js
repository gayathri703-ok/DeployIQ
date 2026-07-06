import EnvVar from "../models/EnvVar.js";

// ======================================
// Create Environment Variable
// ======================================

export const createEnvVar = async (req, res) => {
  try {
    const { projectId, key, value } = req.body;

    if (!projectId || !key || !value) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const envVar = await EnvVar.create({
      projectId,
      key,
      value,
    });

    return res.status(201).json({
      success: true,
      envVar,
    });
  } catch (error) {
    console.error("CREATE ENV VAR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Env Vars By Project
// ======================================

export const getEnvVars = async (req, res) => {
  try {
    const envVars = await EnvVar.find({
      projectId: req.params.projectId,
    });

    return res.status(200).json({
      success: true,
      envVars,
    });
  } catch (error) {
    console.error("GET ENV VARS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Env Var
// ======================================

export const deleteEnvVar = async (req, res) => {
  try {
    const envVar = await EnvVar.findByIdAndDelete(
      req.params.id
    );

    if (!envVar) {
      return res.status(404).json({
        success: false,
        message: "Environment variable not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Environment variable deleted",
    });
  } catch (error) {
    console.error("DELETE ENV VAR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};