import Deployment from "../models/Deployment.js";

export const rollbackDeployment =
  async (req, res) => {
    try {
      const { deploymentId } =
        req.params;

      const deployment =
        await Deployment.findById(
          deploymentId
        );

      if (!deployment) {
        return res.status(404).json({
          success: false,
          message:
            "Deployment not found",
        });
      }

      deployment.status =
        "rolled_back";

      await deployment.save();

      res.json({
        success: true,
        message:
          "Deployment rolled back",
        deployment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };