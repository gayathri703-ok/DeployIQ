import Project from "../models/Project.js";

// ============================================
// GET ALL PROJECTS
// GET /api/projects
// ============================================

export const getProjects = async (req, res) => {
  try {
    console.log("getProjects called");

    const projects = await Project.find().sort({
      createdAt: -1,
    });

    console.log("Projects found:", projects.length);

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// ============================================

export const getProjectById = async (req, res) => {
  try {
    console.log("Project ID:", req.params.id);

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("GET PROJECT BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// CREATE PROJECT
// POST /api/projects
// ============================================

export const createProject = async (req, res) => {
  try {
    const {
      userId,
      name,
      repoName,
      repoUrl,
      branch,
      framework,
    } = req.body;

    const project = await Project.create({
      userId,
      name,
      repoName,
      repoUrl,
      branch: branch || "main",
      framework: framework || "nodejs",
      status: "idle",
    });

    return res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// DELETE PROJECT
// DELETE /api/projects/:id
// ============================================

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};