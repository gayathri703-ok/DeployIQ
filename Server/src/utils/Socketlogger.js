// utils/socketLogger.js
// Helper that emits real-time log events to a deployment room

/**
 * Emit a log line to all clients watching a deployment
 *
 * @param {object} io          - Socket.IO server instance (from app.locals.io)
 * @param {string} deploymentId - MongoDB deployment _id
 * @param {string} message     - Log message
 * @param {"info"|"success"|"error"|"warning"} level - Log level (controls color on frontend)
 */
const emitLog = (io, deploymentId, message, level = "info") => {
  if (!io || !deploymentId) return;

  const logEntry = {
    message,
    level,
    timestamp: new Date().toISOString(),
  };

  io.to(`deployment:${deploymentId}`).emit("deployment:log", logEntry);
  console.log(`[${level.toUpperCase()}] [${deploymentId}] ${message}`);
};

/**
 * Emit a status change event (e.g. "running", "success", "failed")
 *
 * @param {object} io
 * @param {string} deploymentId
 * @param {"queued"|"running"|"success"|"failed"} status
 */
const emitStatus = (io, deploymentId, status) => {
  if (!io || !deploymentId) return;
  io.to(`deployment:${deploymentId}`).emit("deployment:status", { status });
};

module.exports = { emitLog, emitStatus };