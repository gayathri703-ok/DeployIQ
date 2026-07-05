// ============================================
// Log Controller
// ============================================

// ============================================
// Get Logs
// ============================================

export const getDeploymentLogs = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      logs: [
        "🚀 Deployment started",
        "📦 Installing dependencies",
        "🔨 Building project",
        "🐳 Creating Docker image",
        "✅ Deployment successful"
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Alias for old routes
export const getLogs = getDeploymentLogs;

// ============================================
// Stream Logs
// ============================================

export const streamLogs = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      logs: [
        "🚀 Deployment started",
        "📦 Installing dependencies",
        "🔨 Building project",
        "🐳 Creating Docker image",
        "✅ Deployment successful"
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};