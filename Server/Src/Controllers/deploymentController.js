// server/src/controllers/deploymentController.js
// Day 18 — Deployment Queue added

import Deployment from "../models/deployment.js";

// ======================================
// QUEUE SYSTEM
// ======================================

const queue = [];           // array of deploymentIds waiting to run
let isRunning = false;      // only 1 deployment runs at a time

const addToQueue = (io, deploymentId) => {
  queue.push({ io, deploymentId });
  processQueue();
};

const processQueue = async () => {
  // If already running or nothing in queue, do nothing
  if (isRunning || queue.length === 0) return;

  isRunning = true;
  const { io, deploymentId } = queue.shift(); // take first item

  try {
    await runPipeline(io, deploymentId);
  } catch (err) {
    console.error("QUEUE PIPELINE ERROR:", err);
  }

  isRunning = false;
  processQueue(); // process next in queue
};

// ======================================
// HELPER — emit log + save to DB
// ======================================

const pushLog = async (io, deployment, message) => {
  deployment.logs.push(message);
  await deployment.save();
  io.to(`deployment-${deployment._id}`).emit("deployment-log", message);
};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const now = () => {
  const d = new Date();
  return `[${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}]`;
};

// ======================================
// CREATE DEPLOYMENT
// ======================================

export const createDeployment = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // Figure out queue position BEFORE creating
    const queuePosition = queue.length + (isRunning ? 1 : 0);

    const deployment = await Deployment.create({
      projectId,
      status: queuePosition === 0 ? "pending" : "queued",
      logs: [],
      queuePosition,
    });

    // Respond immediately
    res.status(201).json({
      success: true,
      deployment,
      queuePosition,
      message:
        queuePosition === 0
          ? "Deployment started"
          : `Deployment queued at position ${queuePosition}`,
    });

    // Notify all clients about queue update
    const io = req.app.get("io");

    // Emit queue status to the deployment room
    io.to(`deployment-${deployment._id}`).emit("queue-position", {
      position: queuePosition,
      total: queue.length + (isRunning ? 1 : 0) + 1,
    });

    // Add to queue
    addToQueue(io, deployment._id);

  } catch (error) {
    console.error("CREATE DEPLOYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// PIPELINE
// ======================================

const runPipeline = async (io, deploymentId) => {
  try {
    const deployment = await Deployment.findById(deploymentId);
    if (!deployment) return;

    // Mark as running
    deployment.status = "running";
    deployment.queuePosition = 0;
    await deployment.save();

    io.to(`deployment-${deploymentId}`).emit("deployment-status", "running");
    io.to(`deployment-${deploymentId}`).emit("queue-position", { position: 0 });

    // Step 1
    await sleep(1000);
    if ((await Deployment.findById(deploymentId))?.status === "rolled_back") return;
    await pushLog(io, deployment, `${now()} Deployment started`);

    // Step 2
    await sleep(2000);
    if ((await Deployment.findById(deploymentId))?.status === "rolled_back") return;
    await pushLog(io, deployment, `${now()} Cloning repository`);

    // Step 3
    await sleep(2000);
    if ((await Deployment.findById(deploymentId))?.status === "rolled_back") return;
    await pushLog(io, deployment, `${now()} Installing dependencies`);

    // Step 4
    await sleep(2000);
    if ((await Deployment.findById(deploymentId))?.status === "rolled_back") return;
    await pushLog(io, deployment, `${now()} Building application`);

    // Step 5
    await sleep(2000);
    if ((await Deployment.findById(deploymentId))?.status === "rolled_back") return;
    await pushLog(io, deployment, `${now()} Deployment successful`);

    deployment.status = "success";
    await deployment.save();

    io.to(`deployment-${deploymentId}`).emit("deployment-status", "success");

  } catch (error) {
    console.error("PIPELINE ERROR:", error);
    try {
      const deployment = await Deployment.findById(deploymentId);
      if (deployment) {
        deployment.status = "failed";
        deployment.logs.push(`[ERROR] ${error.message}`);
        await deployment.save();
        io.to(`deployment-${deploymentId}`).emit("deployment-status", "failed");
        io.to(`deployment-${deploymentId}`).emit("deployment-log", `[ERROR] ${error.message}`);
      }
    } catch (_) {}
  }
};

// ======================================
// GET QUEUE STATUS
// ======================================

export const getQueueStatus = async (req, res) => {
  try {
    // Get all queued and running deployments from DB
    const activeDeployments = await Deployment.find({
      status: { $in: ["queued", "running", "pending"] },
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      isRunning,
      queueLength: queue.length,
      activeDeployments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL DEPLOYMENTS
// ======================================

export const getDeployments = async (req, res) => {
  try {
    const deployments = await Deployment.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, deployments });
  } catch (error) {
    console.error("GET DEPLOYMENTS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// GET SINGLE DEPLOYMENT
// ======================================

export const getDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id);
    if (!deployment) {
      return res.status(404).json({ success: false, message: "Deployment not found" });
    }
    return res.status(200).json({ success: true, deployment });
  } catch (error) {
    console.error("GET DEPLOYMENT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// DELETE DEPLOYMENT
// ======================================

export const deleteDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findByIdAndDelete(req.params.id);
    if (!deployment) {
      return res.status(404).json({ success: false, message: "Deployment not found" });
    }
    return res.status(200).json({ success: true, message: "Deployment deleted" });
  } catch (error) {
    console.error("DELETE DEPLOYMENT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================
// ROLLBACK DEPLOYMENT
// ======================================

export const rollback = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id);

    if (!deployment) {
      return res.status(404).json({ success: false, message: "Deployment not found" });
    }

    if (deployment.status === "rolled_back") {
      return res.status(400).json({ success: false, message: "Already rolled back" });
    }

    if (!deployment.logs) deployment.logs = [];

    deployment.status = "rolled_back";
    deployment.logs.push(`${now()} Rollback started`);
    deployment.logs.push(`${now()} Previous version restored`);
    deployment.logs.push(`${now()} Rollback successful`);

    await deployment.save();

    return res.status(200).json({
      success: true,
      message: "Deployment rolled back successfully",
      deployment,
    });
  } catch (error) {
    console.error("ROLLBACK ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};