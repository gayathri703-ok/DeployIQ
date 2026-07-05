// client/src/utils/toast.js
// Central toast helper — import this anywhere to show notifications

import toast from "react-hot-toast";

// ── Deployment Toasts ──────────────────────────────────────────

export const toastDeployStarted = () =>
  toast.loading("🚀 Deployment started...", { id: "deploy" });

export const toastDeploySuccess = () =>
  toast.success("🎉 Deployment successful!", {
    id: "deploy",
    duration: 5000,
  });

export const toastDeployFailed = (msg = "") =>
  toast.error(`❌ Deployment failed${msg ? `: ${msg}` : ""}`, {
    id: "deploy",
    duration: 6000,
  });

export const toastDeployQueued = (position) =>
  toast(`⏳ Deployment queued at position #${position}`, {
    icon: "🕐",
    duration: 4000,
    style: {
      background: "#1e293b",
      color: "#fbbf24",
      border: "1px solid #92400e",
    },
  });

// ── Rollback Toasts ────────────────────────────────────────────

export const toastRollbackSuccess = () =>
  toast.success("↩ Rollback successful!", { duration: 4000 });

export const toastRollbackFailed = () =>
  toast.error("❌ Rollback failed", { duration: 5000 });

// ── General Toasts ─────────────────────────────────────────────

export const toastSuccess = (msg) => toast.success(msg, { duration: 3000 });

export const toastError = (msg) => toast.error(msg, { duration: 4000 });

export const toastInfo = (msg) =>
  toast(msg, {
    icon: "ℹ️",
    duration: 3000,
    style: {
      background: "#1e293b",
      color: "#93c5fd",
      border: "1px solid #1e3a5f",
    },
  });

export default toast;