// ============================================
// Docker + Repo Controller
// ============================================

import path from "path";
import fs from "fs";
import simpleGit from "simple-git";
import Docker from "dockerode";

import User from "../models/User.js";
import Project from "../models/Project.js";

// ============================================
// Docker Setup
// ============================================

const docker = new Docker({
  socketPath:
    process.env.DOCKER_HOST ||
    "/var/run/docker.sock",
});

const REPOS_DIR = path.join(
  process.cwd(),
  "repos"
);

// ============================================
// Create repos folder
// ============================================

if (!fs.existsSync(REPOS_DIR)) {
  fs.mkdirSync(REPOS_DIR, {
    recursive: true,
  });
}

// ============================================
// Detect Framework
// ============================================

const detectFramework = (
  repoDir
) => {
  try {
    const pkgPath = path.join(
      repoDir,
      "package.json"
    );

    if (!fs.existsSync(pkgPath)) {
      return "unknown";
    }

    const pkg = JSON.parse(
      fs.readFileSync(
        pkgPath,
        "utf8"
      )
    );

    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    if (deps["next"]) {
      return "nextjs";
    }

    if (deps["react"]) {
      return "react";
    }

    if (deps["vue"]) {
      return "vue";
    }

    if (deps["express"]) {
      return "express";
    }

    return "nodejs";
  } catch {
    return "unknown";
  }
};

// ============================================
// Generate Dockerfile
// ============================================

const generateDockerfile = (
  repoDir,
  framework
) => {
  const dockerfilePath = path.join(
    repoDir,
    "Dockerfile"
  );

  if (
    fs.existsSync(dockerfilePath)
  ) {
    return;
  }

  let content = "";

  if (
    framework === "react" ||
    framework === "vue"
  ) {
    content = `
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
`;
  } else if (
    framework === "nextjs"
  ) {
    content = `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
`;
  } else {
    content = `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;
  }

  fs.writeFileSync(
    dockerfilePath,
    content
  );

  console.log(
    `📄 Dockerfile generated for ${framework}`
  );
};

// ============================================
// Clone Repository
// ============================================

const cloneRepo = async (
  req,
  res
) => {
  try {
    const { projectId } =
      req.body;

    const project =
      await Project.findOne({
        _id: projectId,
        userId: req.user.id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found",
      });
    }

    const user =
      await User.findById(
        req.user.id
      ).select(
        "+githubAccessToken"
      );

    const repoDir = path.join(
      REPOS_DIR,
      `${req.user.id}_${project._id}`
    );

    if (
      fs.existsSync(repoDir)
    ) {
      fs.rmSync(repoDir, {
        recursive: true,
        force: true,
      });
    }

    const authUrl =
      project.repoUrl.replace(
        "https://",
        `https://${user.githubAccessToken}@`
      );

    const git = simpleGit();

    await git.clone(
      authUrl,
      repoDir,
      [
        "--branch",
        project.branch,
        "--depth",
        "1",
      ]
    );

    const framework =
      detectFramework(
        repoDir
      );

    await Project.findByIdAndUpdate(
      projectId,
      { framework }
    );

    res.json({
      success: true,
      message:
        "Repository cloned successfully",
      framework,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ============================================
// Build Docker Image
// ============================================

const buildImage = async (
  req,
  res
) => {
  try {
    const {
      projectId,
    } = req.body;

    const project =
      await Project.findOne({
        _id: projectId,
        userId: req.user.id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found",
      });
    }

    const repoDir = path.join(
      REPOS_DIR,
      `${req.user.id}_${project._id}`
    );

    if (
      !fs.existsSync(repoDir)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Repository not cloned",
      });
    }

    generateDockerfile(
      repoDir,
      project.framework
    );

    const imageName =
      `deployiq-${req.user.id}-${project._id}`.toLowerCase();

    res.json({
      success: true,
      message:
        "Docker build started",
      imageName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ============================================
// Run Container
// ============================================

const runContainer = async (
  req,
  res
) => {
  try {
    const {
      imageName,
      projectId,
      port,
    } = req.body;

    const containerName =
      `deployiq-container-${projectId}`;

    const container =
      await docker.createContainer({
        Image: imageName,

        name: containerName,

        HostConfig: {
          PortBindings: {
            "3000/tcp": [
              {
                HostPort:
                  String(port),
              },
            ],
          },

          RestartPolicy: {
            Name:
              "unless-stopped",
          },
        },

        ExposedPorts: {
          "3000/tcp": {},
        },
      });

    await container.start();

    res.json({
      success: true,
      message:
        "Container started",
      containerId:
        container.id,
      containerName,
      port,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ============================================
// Stop Container
// ============================================

const stopContainer = async (
  req,
  res
) => {
  try {
    const { containerId } =
      req.body;

    const container =
      docker.getContainer(
        containerId
      );

    await container.stop();

    await container.remove();

    res.json({
      success: true,
      message:
        "Container stopped and removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ============================================
// Docker Info
// ============================================

const dockerInfo = async (
  req,
  res
) => {
  try {
    const info =
      await docker.info();

    const version =
      await docker.version();

    res.json({
      success: true,
      dockerVersion:
        version.Version,
      containers:
        info.Containers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Docker not accessible: " +
        error.message,
    });
  }
};

// ============================================
// Get Container Logs
// ============================================

const getContainerLogs =
  async (req, res) => {
    try {
      const container =
        docker.getContainer(
          req.params.containerId
        );

      const logStream =
        await container.logs({
          stdout: true,
          stderr: true,
          tail: 100,
        });

      const logs =
        logStream.toString(
          "utf8"
        );

      res.json({
        success: true,
        logs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  // ============================================
// List Containers
// ============================================

const listContainers = async (req, res) => {
  try {
    const containers = await docker.listContainers({
      all: true,
    });

    res.json({
      success: true,
      containers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Container Statistics
// ============================================

const containerStats = async (req, res) => {
  try {
    const containers = await docker.listContainers({
      all: true,
    });

    let totalMemory = 0;

    for (const item of containers) {
      try {
        const container = docker.getContainer(item.Id);

        const stats =
          await container.stats({
            stream: false,
          });

        totalMemory +=
          stats.memory_stats?.usage || 0;
      } catch {
        continue;
      }
    }

    res.json({
      success: true,
      totalContainers:
        containers.length,

      memoryUsageMB:
        (
          totalMemory /
          1024 /
          1024
        ).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ============================================
// Export
// ============================================

export {
  cloneRepo,
  buildImage,
  runContainer,
  stopContainer,
  dockerInfo,
  getContainerLogs,
  generateDockerfile,
  detectFramework,
  listContainers,
  containerStats,
};