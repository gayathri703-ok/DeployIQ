import Project from "../models/project.js";
import Deployment from "../models/deployment.js";

export const getAnalytics = async (
  req,
  res
) => {
  try {
    const totalProjects =
      await Project.countDocuments();

    const totalDeployments =
      await Deployment.countDocuments();

    const successfulDeployments =
      await Deployment.countDocuments({
        status: "success",
      });

    const rolledBackDeployments =
      await Deployment.countDocuments({
        status: "rolled_back",
      });

    const pendingDeployments =
      await Deployment.countDocuments({
        status: "pending",
      });

    return res.status(200).json({
      success: true,

      analytics: {
        totalProjects,
        totalDeployments,
        successfulDeployments,
        rolledBackDeployments,
        pendingDeployments,
      },
    });
  } catch (error) {
    console.error(
      "ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};