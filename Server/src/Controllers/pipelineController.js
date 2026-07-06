import Project from "../models/Project.js";
import Deployment from "../models/Deployment.js";

export const deployProject = async (
  req,
  res
) => {
  try {

    const { projectId } =
      req.params;

    const project =
      await Project.findById(
        projectId
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found",
      });
    }

    const deployment =
      await Deployment.create({
        projectId,
        status: "pending",
        logs: [
          "[10:00] Deployment started",
          "[10:01] Cloning repository",
          "[10:02] Installing dependencies",
          "[10:03] Building application",
          "[10:04] Running container",
          "[10:05] Generating nginx config",
          "[10:06] Deployment successful",
        ],
      });

    deployment.status =
      "success";

    await deployment.save();

    res.json({
      success: true,
      message:
        "Deployment completed",
      deployment,
    });

  } catch (error) {

  console.log("PIPELINE ERROR:");
  console.log(error);

  res.status(500).json({
    success:false,
    message:error.message
  });

}

  }
