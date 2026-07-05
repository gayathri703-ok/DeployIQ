// client/src/pages/Deploymentpage.jsx
// Day 23 — UI Polish

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  getDeployments,
  deleteDeployment,
  rollbackDeployment,
  createDeployment,
} from "../api/deploymentApi";

import {
  toastDeployStarted,
  toastDeployQueued,
  toastRollbackSuccess,
  toastRollbackFailed,
  toastError,
  toastSuccess,
} from "../utils/toast";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ── Status config ──────────────────────────────────────────────
const STATUS = {
  success:     { label: "SUCCESS",      dot: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",   text: "#22c55e" },
  failed:      { label: "FAILED",       dot: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   text: "#ef4444" },
  running:     { label: "RUNNING",      dot: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  text: "#3b82f6" },
  queued:      { label: "QUEUED",       dot: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  text: "#f59e0b" },
  rolled_back: { label: "ROLLED BACK",  dot: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)", text: "#6b7280" },
  pending:     { label: "PENDING",      dot: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  text: "#f59e0b" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.text, padding: "3px 10px", borderRadius: "20px",
      fontSize: "11px", fontWeight: "700", letterSpacing: "0.06em",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
};

const DeploymentsPage = () => {
  const navigate = useNavigate();

  const [deployments, setDeployments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [creating,    setCreating]    = useState(false);
  const [queue,       setQueue]       = useState({ isRunning: false, queueLength: 0, activeDeployments: [] });
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("all");
  const [sortBy,      setSortBy]      = useState("newest");

  const fetchDeployments = async () => {
    try {
      const data = await getDeployments();
      setDeployments(data.deployments || []);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueue = async () => {
    try {
      const { data } = await axios.get(`${API}/api/deployments/queue`);
      if (data.success) setQueue(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchDeployments();
    fetchQueue();
    const interval = setInterval(() => { fetchQueue(); fetchDeployments(); }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter + Search + Sort
  const filtered = deployments
    .filter((d) => {
      const matchSearch =
        d._id.toLowerCase().includes(search.toLowerCase()) ||
        String(d.projectId).toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || d.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  const handleCreateDeployment = async () => {
    try {
      setCreating(true);
      toastDeployStarted();
      const data = await createDeployment("6a1bd69b495a852d708b9494");
      if (data.queuePosition > 0) toastDeployQueued(data.queuePosition);
      navigate(`/dashboard/deployments/${data.deployment._id}/logs`);
    } catch (error) {
      toastError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deployment?")) return;
    try {
      await deleteDeployment(id);
      setDeployments((prev) => prev.filter((d) => d._id !== id));
      toastSuccess("Deployment deleted");
    } catch { toastError("Failed to delete"); }
  };

  const handleRollback = async (id) => {
    try {
      await rollbackDeployment(id);
      toastRollbackSuccess();
      fetchDeployments();
    } catch { toastRollbackFailed(); }
  };

  // Stats
  const stats = {
    total:   deployments.length,
    success: deployments.filter((d) => d.status === "success").length,
    failed:  deployments.filter((d) => d.status === "failed").length,
    running: deployments.filter((d) => d.status === "running").length,
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #1f2535", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading deployments...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Top Bar ── */}
      <div style={{ background: "#0d1117", borderBottom: "1px solid #1f2535", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f1f5f9", margin: 0 }}>Deployments</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "2px 0 0" }}>Manage and monitor your deployments</p>
        </div>
        <button
          onClick={handleCreateDeployment}
          disabled={creating}
          style={{
            background: creating ? "#1e293b" : "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white", border: "none", padding: "10px 20px",
            borderRadius: "10px", cursor: creating ? "not-allowed" : "pointer",
            fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px",
            boxShadow: creating ? "none" : "0 4px 15px rgba(59,130,246,0.3)",
          }}
        >
          {creating ? "⏳ Creating..." : "🚀 New Deployment"}
        </button>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total",      value: stats.total,   icon: "🚀", color: "#3b82f6", bg: "rgba(59,130,246,0.08)"  },
            { label: "Successful", value: stats.success, icon: "✅", color: "#22c55e", bg: "rgba(34,197,94,0.08)"   },
            { label: "Failed",     value: stats.failed,  icon: "❌", color: "#ef4444", bg: "rgba(239,68,68,0.08)"   },
            { label: "Running",    value: stats.running, icon: "⚡", color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
          ].map((s) => (
            <div key={s.label} style={{
              background: s.bg, border: `1px solid ${s.color}22`,
              borderRadius: "12px", padding: "18px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "22px" }}>{s.icon}</span>
                <span style={{ fontSize: "28px", fontWeight: "800", color: s.color }}>{s.value}</span>
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Queue Banner ── */}
        {queue.isRunning && (
          <div style={{
            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "12px", padding: "14px 20px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block", flexShrink: 0 }} />
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>
              Deployment running · <strong style={{ color: "#f59e0b" }}>{queue.queueLength} waiting</strong> in queue
            </span>
          </div>
        )}

        {/* ── Search + Filter + Sort ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px", alignItems: "center" }}>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: "14px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search deployments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "#13161e", border: "1px solid #1f2535",
                borderRadius: "10px", padding: "9px 14px 9px 34px",
                color: "#f1f5f9", fontSize: "13px", outline: "none", width: "220px",
              }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["all", "success", "failed", "running", "queued", "rolled_back"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "7px 14px", borderRadius: "20px", fontSize: "12px",
                fontWeight: "600", cursor: "pointer", border: "1px solid",
                textTransform: "capitalize", transition: "all 0.15s",
                background: filter === f ? "#3b82f6" : "transparent",
                color:      filter === f ? "#fff"    : "#6b7280",
                borderColor: filter === f ? "#3b82f6" : "#1f2535",
              }}>
                {f.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: "#13161e", border: "1px solid #1f2535",
              borderRadius: "10px", padding: "8px 12px",
              color: "#94a3b8", fontSize: "13px", outline: "none",
              cursor: "pointer", marginLeft: "auto",
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* ── Results count ── */}
        <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "16px" }}>
          Showing <strong style={{ color: "#94a3b8" }}>{filtered.length}</strong> of{" "}
          <strong style={{ color: "#94a3b8" }}>{deployments.length}</strong> deployments
        </p>

        {/* ── Empty state ── */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "#13161e", borderRadius: "16px", border: "1px solid #1f2535",
          }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</p>
            <p style={{ color: "#94a3b8", fontWeight: "600", fontSize: "16px" }}>No deployments found</p>
            <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "6px" }}>Try a different search term or filter</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((deployment) => (
              <div key={deployment._id} style={{
                background: "#13161e", border: "1px solid #1f2535",
                borderRadius: "14px", padding: "18px 22px",
                transition: "border-color 0.2s",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", flexWrap: "wrap", gap: "14px",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#2a3050"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1f2535"}
              >
                {/* Left — info */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

                  {/* Status dot */}
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "10px",
                    background: STATUS[deployment.status]?.bg || "rgba(107,114,128,0.1)",
                    border: `1px solid ${STATUS[deployment.status]?.border || "#1f2535"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", flexShrink: 0,
                  }}>
                    {deployment.status === "success"     ? "✅" :
                     deployment.status === "failed"      ? "❌" :
                     deployment.status === "running"     ? "⚡" :
                     deployment.status === "queued"      ? "⏳" :
                     deployment.status === "rolled_back" ? "↩" : "🔵"}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: "700", color: "#f1f5f9", fontSize: "14px" }}>
                        #{deployment._id.slice(-8)}
                      </span>
                      <StatusBadge status={deployment.status} />
                      {deployment.status === "queued" && (
                        <span style={{ color: "#f59e0b", fontSize: "11px" }}>pos #{deployment.queuePosition}</span>
                      )}
                    </div>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>
                      Project: <span style={{ color: "#94a3b8", fontFamily: "monospace" }}>{String(deployment.projectId).slice(-8)}</span>
                      {deployment.createdAt && (
                        <span style={{ marginLeft: "10px" }}>
                          · {new Date(deployment.createdAt).toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right — actions */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button onClick={() => navigate(`/dashboard/deployments/${deployment._id}`)}
                    style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid #1f2535", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>
                    View
                  </button>
                  <button onClick={() => navigate(`/dashboard/deployments/${deployment._id}/logs`)}
                    style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                    Live Logs
                  </button>
                  <button onClick={() => handleRollback(deployment._id)}
                    style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.08)", color: "#f59e0b", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>
                    Rollback
                  </button>
                  <button onClick={() => handleDelete(deployment._id)}
                    style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default DeploymentsPage;