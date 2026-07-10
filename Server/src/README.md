# 🚀 DeployIQ — AI-Powered Deployment Automation Platform

<div align="center">

![DeployIQ Banner](https://img.shields.io/badge/DeployIQ-Deployment%20Platform-blue?style=for-the-badge&logo=rocket)

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://docker.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel)](https://deploy-iq-mjm7.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)](https://deployiq-1.onrender.com)

**A full-stack DevOps platform inspired by Vercel, Render, and Railway.**
Deploy GitHub repositories, monitor containers, manage environments — all from one dashboard.

🌐 **Live Demo:** [deploy-iq-mjm7.vercel.app](https://deploy-iq-mjm7.vercel.app)

[Features](#-features) · [Demo](#-live-demo) · [Installation](#-installation) · [API Docs](#-api-documentation) · [Architecture](#-architecture)

</div>

---

## 📸 Screenshots

| Dashboard | Deployment Logs |
|-----------|----------------|
| ![Dashboard](screenshots/dashboard.png) | ![Logs](screenshots/logs.png) |

| Monitoring | Admin Dashboard |
|------------|-----------------|
| ![Monitoring](screenshots/monitoring.png) | ![Admin](screenshots/admin.png) |

| Projects | Deployments |
|----------|-------------|
| ![Projects](screenshots/projects.png) | ![Deployments](screenshots/deployments.png) |

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🌐 Frontend | [deploy-iq-mjm7.vercel.app](https://deploy-iq-mjm7.vercel.app) |
| ⚙️ Backend API | [deployiq-1.onrender.com](https://deployiq-1.onrender.com) |
| 📂 GitHub Repo | [github.com/gayathri703-ok/DeployIQ](https://github.com/gayathri703-ok/DeployIQ) |

---

## ✨ Features

### 🔐 Authentication
- JWT-based login and registration
- Protected routes
- Forgot password flow
- Persistent sessions

### 📁 Project Management
- Create and manage deployment projects
- GitHub repository integration
- Branch selection
- Automatic framework detection (React, Next.js, Vue, Express, Node.js)

### 🚀 Deployment System
- One-click deployments
- **Real-time log streaming** via Socket.IO
- **Deployment queue** — one deployment runs at a time
- Rollback to any previous deployment
- Deployment history with timestamps

### 📡 Real-Time Features
- Live deployment logs (no page refresh)
- Pipeline step progress indicator
- WebSocket-powered status updates
- Auto-scroll terminal UI

### 📊 Analytics & Monitoring
- **Monitoring Dashboard** — CPU, Memory, Disk usage with live gauges
- **CI/CD Dashboard** — success rate, deployment trends
- **Deployment Analytics** — total, successful, failed, rollbacks
- Docker container status and stats

### 🌍 Infrastructure
- Docker container management (build, run, stop)
- Nginx configuration generator
- Environment variable management
- Custom domain management

### 🔔 Notifications
- Toast notifications for all events (deploy, rollback, delete)
- Real-time status updates via Socket.IO

### 🔍 Search & Filters
- Search deployments by ID or project
- Filter by status (success, failed, running, queued)
- Sort by date (newest/oldest)
- Project search with status filters

### 👑 Admin Dashboard
- Total users, projects, deployments overview
- Success rate analytics
- Recent users and deployments
- Project and deployment status breakdown

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Socket.IO Client | Real-time communication |
| Axios | HTTP requests |
| React Hot Toast | Notifications |
| Recharts | Analytics charts |
| Tailwind CSS | Styling |
| Zustand | State management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database |
| Socket.IO | WebSocket server |
| JWT | Authentication |
| bcryptjs | Password hashing |
| systeminformation | System metrics |
| Dockerode | Docker API |
| simple-git | Git operations |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| Docker | Container runtime |
| Nginx | Reverse proxy / config generation |
| GitHub API | Repository integration |
| MongoDB Atlas | Cloud database |
| Vercel | Frontend hosting |
| Render | Backend hosting |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│              CLIENT (React) — Vercel                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Dashboard │ │Projects  │ │Deployments│ │Monitoring│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│         │           │            │              │        │
│         └───────────┴────────────┴──────────────┘       │
│                          │                               │
│              Axios (REST) + Socket.IO                    │
└──────────────────────────┼──────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────┐
│         SERVER (Express + Socket.IO) — Render            │
│                          │                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │                  API Routes                      │    │
│  │  /api/auth  /api/projects  /api/deployments      │    │
│  │  /api/monitoring  /api/admin  /api/docker        │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Deployment│ │ Queue    │ │ Socket   │ │Monitoring│  │
│  │Pipeline  │ │ System   │ │ Events   │ │ Service  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└──────────────────────────┼──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                   │
   ┌────┴────┐      ┌──────┴──────┐    ┌──────┴──────┐
   │ MongoDB │      │   Docker    │    │    Nginx    │
   │  Atlas  │      │ Containers  │    │   Config    │
   └─────────┘      └─────────────┘    └─────────────┘
```

### Deployment Pipeline
```
GitHub Repo
    │
    ▼
Clone Repository
    │
    ▼
Detect Framework
    │
    ▼
Install Dependencies
    │
    ▼
Build Project
    │
    ▼
Create Docker Image
    │
    ▼
Start Container
    │
    ▼
Generate Nginx Config
    │
    ▼
🎉 Deployment Live
```

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Docker (optional, for container features)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/gayathri703-ok/DeployIQ.git
cd DeployIQ
```

### 2. Backend Setup
```bash
cd Server
npm install
```

Create `Server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
DOCKER_HOST=/var/run/docker.sock
ENCRYPTION_KEY=your_32_char_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/github/callback
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd Server/client
npm install
```

Create `Server/client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start the client:
```bash
npm start
```

### 4. Open the App
```
http://localhost:3000
```

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Send reset email |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get single project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Deployments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/deployments` | Get all deployments |
| POST | `/api/deployments` | Create deployment |
| GET | `/api/deployments/queue` | Get queue status |
| GET | `/api/deployments/:id` | Get single deployment |
| DELETE | `/api/deployments/:id` | Delete deployment |
| POST | `/api/deployments/:id/rollback` | Rollback deployment |

### Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/monitoring/summary` | CPU, Memory, Disk, Containers |
| GET | `/api/monitoring/system` | System stats only |
| GET | `/api/monitoring/containers` | Docker container status |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/summary` | Full system overview |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/projects` | All projects |

---

## 🔌 Socket.IO Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-deployment` | `deploymentId` | Join deployment room |
| `leave-deployment` | `deploymentId` | Leave deployment room |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `deployment-log` | `string` | New log line |
| `deployment-status` | `string` | Status change |
| `queue-position` | `{ position }` | Queue update |

---

## 📁 Project Structure

```
DeployIQ/
├── README.md
├── Server/
│   ├── server.js                 # Entry point + Socket.IO
│   └── src/
│       ├── config/
│       │   └── db.js             # MongoDB connection
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── deploymentController.js
│       │   ├── dockerController.js
│       │   ├── monitoringController.js
│       │   └── adminController.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Project.js
│       │   └── deployment.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── deploymentRoutes.js
│       │   ├── monitoringRoutes.js
│       │   └── adminRoutes.js
│       └── middleware/
│           ├── authmiddleware.js
│           ├── errorHandler.js
│           └── rateLimitermiddleware.js
│
└── Server/client/
    └── src/
        ├── pages/
        │   ├── auth/
        │   ├── Dashboards/
        │   ├── Deploymentpage.jsx
        │   ├── moniteringDashboard.jsx
        │   └── AdminDashboard.jsx
        ├── layouts/
        │   └── Dashboardlayouts.jsx
        ├── api/
        ├── store/
        ├── utils/
        │   └── toast.js
        └── socket.js
```

---

## 🎯 Key Implementation Highlights

### Real-Time Deployment Logs
Uses Socket.IO rooms — each deployment gets its own room. The pipeline emits log events as each step completes, streamed live to the browser without polling.

### Deployment Queue
In-memory queue ensures only one deployment runs at a time. New deployments are added to the queue and processed automatically when the current one finishes.

### System Monitoring
Uses the `systeminformation` npm package to read real CPU, memory, and disk metrics directly from the OS. Updates every 5 seconds via polling.

### Docker Integration
Uses the `dockerode` library to communicate with the Docker daemon via Unix socket. Supports listing, starting, stopping containers and reading live stats.

---

## 🏆 What This Project Demonstrates

| Skill | Implementation |
|-------|----------------|
| **Full-Stack Development** | React frontend + Node.js backend |
| **Real-Time Communication** | Socket.IO WebSocket integration |
| **Database Design** | MongoDB schemas, relationships, aggregation |
| **Authentication** | JWT, bcrypt, protected routes |
| **DevOps Concepts** | Docker, Nginx, CI/CD pipeline simulation |
| **System Programming** | OS metrics, Docker API |
| **Queue Systems** | In-memory deployment queue |
| **REST API Design** | 20+ endpoints across 10+ resources |
| **State Management** | Zustand store |
| **Production Deployment** | Vercel + Render + MongoDB Atlas |

---

## 👤 Author

**Gayathri**
- 🐙 GitHub: [@gayathri703-ok](https://github.com/gayathri703-ok)
- 💼 LinkedIn: [linkedin.com/in/gayathri703](https://www.linkedin.com/in/gayathri703)
- 🌐 Live Project: [deploy-iq-mjm7.vercel.app](https://deploy-iq-mjm7.vercel.app)
- 📂 Repository: [github.com/gayathri703-ok/DeployIQ](https://github.com/gayathri703-ok/DeployIQ)

---

## 📄 License

MIT License — feel free to use this project as a reference or template.

---

<div align="center">
  <strong>Built with ❤️ as a portfolio project to demonstrate full-stack + DevOps skills</strong>
  <br><br>
  <a href="https://github.com/gayathri703-ok/DeployIQ">⭐ Star this repo if you found it helpful!</a>
</div>