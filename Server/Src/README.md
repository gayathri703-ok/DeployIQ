# DeployIQ — Backend

> AI-Powered Deployment Platform Backend (Like Vercel / Railway)

---

## 🗓 21-Day Roadmap — Implementation Checklist

### Days 1–7: Foundation

| Day | Task | File | Status |
|-----|------|------|--------|
| Day 1 | Project Setup, Express, Folder Structure | `server.js` | ✅ |
| Day 2 | MongoDB Setup, Connect, Test | `config/db.js` | ✅ |
| Day 3 | Authentication (Register/Login/JWT) | `controllers/authController.js`, `middleware/auth.js` | ✅ |
| Day 4 | User & Project APIs | `controllers/userController.js` | ✅ |
| Day 5 | GitHub Integration (OAuth) | `controllers/githubController.js` | ✅ |
| Day 6 | Clone Repository | `controllers/dockerController.js → cloneRepo` | ✅ |
| Day 7 | Docker Setup + Test API | `controllers/dockerController.js → dockerInfo` | ✅ |

### Days 8–14: Core Engine

| Day | Task | File | Status |
|-----|------|------|--------|
| Day 8 | Generate Dockerfile | `controllers/dockerController.js → generateDockerfile` | ✅ |
| Day 9 | Build Docker Image | `controllers/dockerController.js → buildImage` | ✅ |
| Day 10 | Run Docker Container + Get Live URL | `controllers/dockerController.js → runContainer` | ✅ |
| Day 11 | (Get Live URL generated in deployController) | `controllers/deployController.js` | ✅ |
| Day 12 | Deployment Logs (Save to DB) | `models/Deployment.js → Log`, `routes/logRoutes.js` | ✅ |
| Day 13 | Get Logs API + Formatted Output | `routes/logRoutes.js` | ✅ |
| Day 14 | Stop Container + Delete Deployment API | `controllers/deployController.js → deleteDeployment` | ✅ |

### Days 15–21: Advanced Features

| Day | Task | File | Status |
|-----|------|------|--------|
| Day 15 | Real-Time Logs (Socket.IO) | `server.js → io setup`, `deployController.js → saveLog` | ✅ |
| Day 16 | Framework Detection | `controllers/dockerController.js → detectFramework` | ✅ |
| Day 17 | Environment Variables (Encrypted) | `controllers/envVarController.js` | ✅ |
| Day 18 | Restart / Rebuild APIs | `controllers/deployController.js → createDeployment` | ✅ |
| Day 19 | Reverse Proxy with NGINX | `controllers/nginxController.js`, `nginx/nginx.conf` | ✅ |
| Day 20 | Production Deployment (Docker + Compose) | `Dockerfile`, `docker-compose.yml` | ✅ |
| Day 21 | Custom Domains + SSL Setup | `nginx/nginx.conf` (add certbot step below) | ✅ |

---

## 🚀 Quick Start

```bash
# 1. Clone / open this folder in VS Code
cd deployiq-backend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI, GitHub OAuth keys, OpenAI key

# 4. Start MongoDB (if running locally)
mongod

# 5. Start the dev server
npm run dev
# → Server running at http://localhost:5000
```

## 🐳 Docker / Production Start

```bash
# Build and start everything
docker-compose up --build

# Stop
docker-compose down
```

---

## 📡 API Endpoints Summary

### Auth
```
POST   /api/auth/register     — Create account
POST   /api/auth/login        — Login, get JWT
POST   /api/auth/logout       — Logout
GET    /api/auth/me           — Get current user
```

### Users & Projects
```
GET    /api/users/profile          — Your profile
GET    /api/users/projects         — All your projects
POST   /api/users/projects         — Create project
GET    /api/users/projects/:id     — Project + deployments
DELETE /api/users/projects/:id     — Delete project
```

### GitHub
```
GET    /api/github/connect         — Get OAuth redirect URL
GET    /api/github/callback        — OAuth callback (GitHub redirects here)
GET    /api/github/repos           — List your repos
POST   /api/github/validate        — Check repo access
DELETE /api/github/disconnect      — Unlink GitHub
```

### Deployments
```
POST   /api/deployments            — Trigger new deploy
GET    /api/deployments            — List deployments
GET    /api/deployments/:id        — Deployment + logs
DELETE /api/deployments/:id        — Delete + stop container
POST   /api/deployments/:id/rollback — Rollback
```

### Logs
```
GET    /api/logs/:deploymentId     — Get build logs
DELETE /api/logs/:deploymentId     — Clear logs
```

### Docker
```
GET    /api/docker/info            — Docker version/info
POST   /api/docker/build           — Build image
POST   /api/docker/run             — Start container
POST   /api/docker/stop            — Stop container
GET    /api/docker/logs/:id        — Container runtime logs
```

### Environment Variables
```
POST   /api/env                    — Add variable
GET    /api/env/:projectId         — List (masked)
GET    /api/env/:projectId/reveal/:id — Reveal value
DELETE /api/env/:id                — Delete
```

### NGINX
```
GET    /api/nginx                  — List proxy configs
POST   /api/nginx                  — Create proxy
DELETE /api/nginx/:subdomain       — Remove proxy
```

---

## 🔌 Real-Time Logs (Socket.IO)

```js
// Frontend — connect and listen
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Join a deployment room to get live logs
socket.emit("join-deployment", deploymentId);

socket.on("log", ({ level, message, timestamp }) => {
  console.log(`[${level}] ${message}`);
});

socket.on("deployment-complete", ({ deployedUrl }) => {
  console.log("Live at:", deployedUrl);
});

socket.on("deployment-failed", ({ error }) => {
  console.error("Failed:", error);
});
```

---

## 🔐 Day 21 — SSL with Certbot

```bash
# On your VPS (after pointing domain DNS to your server IP)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo certbot renew --dry-run
```

---

## 📁 Folder Structure

```
deployiq-backend/
├── server.js              # Day 1 — entry point
├── package.json
├── Dockerfile             # Day 20
├── docker-compose.yml     # Day 20
├── .env.example
├── config/
│   └── db.js              # Day 2 — MongoDB
├── controllers/
│   ├── authController.js  # Day 3
│   ├── userController.js  # Day 4
│   ├── githubController.js # Day 5-6
│   ├── dockerController.js # Day 7-9, 13
│   ├── deployController.js # Day 12, 14-15, 18
│   ├── envVarController.js # Day 17
│   └── nginxController.js  # Day 19
├── middleware/
│   ├── auth.js            # Day 3 — JWT protect
│   ├── errorHandler.js
│   └── rateLimiter.js
├── models/
│   ├── User.js            # Day 3
│   ├── Project.js         # Day 4
│   └── Deployment.js      # Day 12 (+ Log + EnvVar)
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── githubRoutes.js
│   ├── repoRoutes.js
│   ├── dockerRoutes.js
│   ├── deployRoutes.js
│   ├── logRoutes.js
│   ├── envVarRoutes.js
│   └── nginxRoutes.js
├── services/
│   └── aiService.js       # Day 14+ — OpenAI
├── nginx/
│   └── nginx.conf         # Day 19
└── repos/                 # Cloned repos (gitignored)
```
