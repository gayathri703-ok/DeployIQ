import Deployment from "../models/Deployment.js";

export const getCICDStats = async (req, res) => {
  try {

    const totalDeployments =
      await Deployment.countDocuments();

    const successfulDeployments =
      await Deployment.countDocuments({
        status: "success",
      });

    const failedDeployments =
      await Deployment.countDocuments({
        status: "failed",
      });

    const rollbackDeployments =
      await Deployment.countDocuments({
        status: "rolled_back",
      });

    const recentDeployments =
      await Deployment.find()
        .sort({ createdAt: -1 })
        .limit(10);

    res.json({
      success: true,

      stats: {
        totalDeployments,
        successfulDeployments,
        failedDeployments,
        rollbackDeployments,
      },

      recentDeployments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};