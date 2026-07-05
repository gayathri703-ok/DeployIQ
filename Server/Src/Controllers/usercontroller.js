// ============================================
// DAY 4 — User & Project Controller
// Get Profile / Create Project / Get Projects
// ============================================
const User = require("../models/User");
const Project = require("../models/Project");
const { Deployment } = require("../models/Deployment");

// ── GET /api/users/profile ───────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/users/projects ──────────────────────────────────
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/users/projects ─────────────────────────────────
exports.createProject = async (req, res) => {
  try {
    const { name, repoName, repoUrl, repoFullName, framework, branch, buildCommand, startCommand } = req.body;

    if (!name || !repoUrl) {
      return res.status(400).json({ success: false, message: "Name and repoUrl are required" });
    }

    const project = await Project.create({
      userId: req.user.id,
      name,
      repoName: repoName || name,
      repoUrl,
      repoFullName,
      framework: framework || "unknown",
      branch: branch || "main",
      buildCommand,
      startCommand,
    });

    res.status(201).json({ success: true, message: "Project created", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/users/projects/:id ──────────────────────────────
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const deployments = await Deployment.find({ projectId: project._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, project, deployments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/users/projects/:id ──────────────────────────
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
