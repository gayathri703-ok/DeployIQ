# Day 17 — Real-Time Deployment Logs (Socket.IO)

## What You're Building
Live deployment logs that stream to the browser in real-time — no page refresh needed.

## Files to Create / Modify

### Backend
- `server.js` — add Socket.IO setup
- `utils/socketLogger.js` — NEW: helper to emit logs
- `controllers/deploymentController.js` — modify to emit real-time logs

### Frontend
- `src/socket.js` — NEW: socket client singleton
- `src/pages/DeploymentLogs.jsx` — NEW: live log viewer page
- `src/pages/DeploymentLogs.css` — NEW: styling

---

## Installation

```bash
# Backend
npm install socket.io

# Frontend
npm install socket.io-client
```