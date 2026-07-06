import express from "express";

import {
cloneRepo,
buildImage,
runContainer,
stopContainer,
dockerInfo,
getContainerLogs,
listContainers,
containerStats,
} from "../controllers/dockerController.js";

import protect from "../middleware/authmiddleware.js";

const router = express.Router();

// ============================================
// Repository Operations
// ============================================

router.post(
"/clone",
protect,
cloneRepo
);

// ============================================
// Docker Build
// ============================================

router.post(
"/build",
protect,
buildImage
);

// ============================================
// Container Management
// ============================================

router.post(
"/run",
protect,
runContainer
);

router.post(
"/stop",
protect,
stopContainer
);

// ============================================
// Docker Information
// ============================================

router.get(
"/info",
protect,
dockerInfo
);

// ============================================
// List Containers
// ============================================

router.get(
"/containers",
protect,
listContainers
);

// ============================================
// Container Statistics
// ============================================

router.get(
"/stats",
protect,
containerStats
);

// ============================================
// Container Logs
// ============================================

router.get(
"/logs/:containerId",
protect,
getContainerLogs
);

// ============================================
// Export Router
// ============================================

export default router;
