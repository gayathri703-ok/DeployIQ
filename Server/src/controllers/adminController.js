// server/src/controllers/adminController.js

import User       from "../models/User.js";
import Project    from "../models/Project.js";
import Deployment from "../models/deployment.js";

// ======================================
// GET ADMIN SUMMARY
// Single endpoint — frontend calls this
// ======================================

export const getAdminSummary = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalProjects,
      totalDeployments,
      successDeployments,
      failedDeployments,
      recentUsers,
      recentDeployments,
      projectsByStatus,
      deploymentsByStatus,
    ] = await Promise.all([

      // User stats
      User.countDocuments(),
      User.countDocuments({ isActive: true }),

      // Project stats
      Project.countDocuments(),

      // Deployment stats
      Deployment.countDocuments(),
      Deployment.countDocuments({ status: "success" }),
      Deployment.countDocuments({ status: "failed" }),

      // Recent users (last 5)
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role isActive createdAt githubConnected"),

      // Recent deployments (last 5)
      Deployment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("projectId status createdAt logs"),

      // Projects grouped by status
      Project.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Deployments grouped by status
      Deployment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    // Calculate success rate
    const successRate =
      totalDeployments > 0
        ? ((successDeployments / totalDeployments) * 100).toFixed(1)
        : 0;

    // Format project status breakdown
    const projectStatus = {};
    projectsByStatus.forEach((p) => {
      projectStatus[p._id] = p.count;
    });

    // Format deployment status breakdown
    const deploymentStatus = {};
    deploymentsByStatus.forEach((d) => {
      deploymentStatus[d._id] = d.count;
    });

    return res.status(200).json({
      success: true,
      stats: {
        users: {
          total:  totalUsers,
          active: activeUsers,
        },
        projects: {
          total:  totalProjects,
          status: projectStatus,
        },
        deployments: {
          total:       totalDeployments,
          success:     successDeployments,
          failed:      failedDeployments,
          successRate: Number(successRate),
          status:      deploymentStatus,
        },
      },
      recentUsers,
      recentDeployments,
    });
  } catch (error) {
    console.error("ADMIN SUMMARY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL USERS
// ======================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("name email role isActive createdAt githubConnected githubUsername");

    return res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// GET ALL PROJECTS (admin view)
// ======================================

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    return res.status(200).json({
      success: true,
      total: projects.length,
      projects,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};