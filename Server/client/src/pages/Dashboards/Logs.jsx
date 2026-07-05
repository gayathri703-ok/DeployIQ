// client/src/pages/Dashboards/Logs.jsx
// Day 20 — Toast notifications added

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket";
import {
  toastDeploySuccess,
  toastDeployFailed,
  toastInfo,
} from "../../utils/toast";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const STEPS = [
  { label: "Started",    match: "started"    },
  { label: "Cloning",    match: "cloning"    },
  { label: "Installing", match: "installing" },
  { label: "Building",   match: "building"   },
  { label: "Successful", match: "successful" },
];

const getStepIndex = (log = "") => {
  const l = log.toLowerCase();
  return STEPS.findIndex((s) => l.includes(s.match));
};

export default function Logs() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [logs,          setLogs]          = useState([]);
  const [status,        setStatus]        = useState("pending");
  const [connected,     setConnected]     = useState(false);
  const [activeStep,    setActiveStep]    = useState(-1);
  const [autoScroll,    setAutoScroll]    = useState(true);
  const [loading,       setLoading]       = useState(true);
  const [queuePosition, setQueuePosition] = useState(null);

  const bottomRef = useRef(null);
  const termRef   = useRef(null);
  const toastFired = useRef(false); // ✅ prevent duplicate toasts

  // ── Load existing deployment ───────────────────────────────
  useEffect(() => {
    const fetchDeployment = async () => {
      try {
        const { data } = await axios.get(`${API}/api/deployments/${id}`);
        if (data.success) {
          setLogs(data.deployment.logs || []);
          setStatus(data.deployment.status);
          setQueuePosition(data.deployment.queuePosition ?? null);
          const lastLog = (data.deployment.logs || []).at(-1) || "";
          const idx = getStepIndex(lastLog);
          if (idx !== -1) setActiveStep(idx);

          // ✅ If already finished, show toast once
          if (data.deployment.status === "success" && !toastFired.current) {
            toastDeploySuccess();
            toastFired.current = true;
          }
          if (data.deployment.status === "failed" && !toastFired.current) {
            toastDeployFailed();
            toastFired.current = true;
          }
        }
      } catch (err) {
        console.error("Failed to load deployment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeployment();
  }, [id]);

  // ── Socket.IO ──────────────────────────────────────────────
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-deployment", id);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("deployment-log", (log) => {
      setLogs((prev) => [...prev, log]);
      const idx = getStepIndex(log);
      if (idx !== -1) setActiveStep(idx);
    });

    socket.on("deployment-status", (s) => {
      setStatus(s);

      // ✅ Fire toast based on status
      if (s === "success" && !toastFired.current) {
        toastDeploySuccess();
        toastFired.current = true;
        setActiveStep(STEPS.length - 1);
      }
      if (s === "failed" && !toastFired.current) {
        toastDeployFailed();
        toastFired.current = true;
      }
    });

    socket.on("queue-position", ({ position }) => {
      setQueuePosition(position);
      if (position === 0) {
        setStatus("running");
        toastInfo("🚀 Your deployment is now running!"); // ✅ toast when starts
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("deployment-log");
      socket.off("deployment-status");
      socket.off("queue-position");
      socket.disconnect();
    };
  }, [id]);

  // ── Auto scroll ────────────────────────────────────────────
  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, autoScroll]);

  const handleScroll = () => {
    const el = termRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setAutoScroll(atBottom);
  };

  const statusColors = {
    pending:     "bg-yellow-500",
    queued:      "bg-yellow-500",
    running:     "bg-blue-500",
    success:     "bg-green-500",
    failed:      "bg-red-500",
    rolled_back: "bg-gray-500",
  };

  const logColor = (log = "") => {
    const l = log.toLowerCase();
    if (l.includes("successful") || l.includes("success")) return "text-green-400";
    if (l.includes("error") || l.includes("failed"))       return "text-red-400";
    if (l.includes("warning"))                              return "text-yellow-400";
    if (l.includes("cloning") || l.includes("building") ||
        l.includes("installing"))                           return "text-blue-400";
    return "text-gray-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading deployment logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition text-sm">
              ← Back
            </button>
            <h1 className="text-xl font-semibold">Deployment Logs</h1>
            <span className="text-xs font-mono bg-[#1f2535] text-gray-400 px-2 py-1 rounded">
              #{id.slice(-8)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />
            <span className="text-xs text-gray-400">{connected ? "Live" : "Offline"}</span>
            <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full text-white ${statusColors[status] || "bg-gray-600"}`}>
              {status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* ── Queue Banner ── */}
        {(status === "queued" || (status === "pending" && queuePosition > 0)) && (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-semibold text-sm">
                Waiting in Queue — Position #{queuePosition}
              </p>
              <p className="text-yellow-600 text-xs mt-1">
                Another deployment is currently running. Yours will start automatically.
              </p>
            </div>
          </div>
        )}

        {/* ── Pipeline Steps ── */}
        <div className="bg-[#13161e] border border-[#1f2535] rounded-xl p-5">
          <div className="flex items-center overflow-x-auto">
            {STEPS.map((step, i) => {
              const done    = i <= activeStep;
              const current = i === activeStep && status === "running";
              const failed  = status === "failed" && i === activeStep;
              return (
                <div key={step.label} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                      ${failed  ? "bg-red-500 border-red-500 text-white"  :
                        done    ? "bg-green-500 border-green-500 text-white" :
                        current ? "border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" :
                                  "border-[#2a3050] text-gray-600"}
                    `}>
                      {done && !current ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap
                      ${failed  ? "text-red-400"   :
                        done    ? "text-green-400" :
                        current ? "text-blue-400"  : "text-gray-600"}
                    `}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-10 md:w-16 h-0.5 mb-5 mx-1 transition-all duration-500
                      ${i < activeStep ? "bg-green-500" : "bg-[#1f2535]"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Terminal ── */}
        <div className="rounded-xl overflow-hidden border border-[#1f2535]">
          <div className="bg-[#1a1d27] px-4 py-3 flex items-center gap-3 border-b border-[#1f2535]">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f05e5e]" />
              <span className="w-3 h-3 rounded-full bg-[#f5a623]" />
              <span className="w-3 h-3 rounded-full bg-[#3ecf8e]" />
            </div>
            <span className="font-mono text-xs text-gray-500 flex-1">
              stdout — deployment:{id.slice(-8)}
            </span>
            <button
              onClick={() => { setAutoScroll(true); bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }}
              className={`text-xs px-2 py-1 rounded border transition
                ${autoScroll ? "border-blue-500 text-blue-400" : "border-[#2a3050] text-gray-500 hover:border-blue-500 hover:text-blue-400"}`}
            >
              ↓ Auto-scroll
            </button>
          </div>

          <div ref={termRef} onScroll={handleScroll}
            className="bg-[#0a0c12] h-96 overflow-y-auto p-4 font-mono text-sm space-y-1"
          >
            {logs.length === 0 ? (
              <div className="flex items-center gap-3 text-gray-600 py-4">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>
                  {status === "queued"
                    ? `Queued at position #${queuePosition} — waiting…`
                    : "Waiting for deployment to start…"}
                </span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`flex gap-3 items-start leading-relaxed ${logColor(log)}`}>
                  <span className="text-[#2a3050] text-xs flex-shrink-0 mt-0.5 select-none">
                    {String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="break-all">{log}</span>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <span><strong className="text-gray-300">{logs.length}</strong> lines</span>
          <span><strong className="text-gray-300">{logs.filter((l) => l.toLowerCase().includes("error")).length}</strong> errors</span>
          {status === "success"     && <span className="text-green-400 font-semibold">🎉 Deployment successful</span>}
          {status === "failed"      && <span className="text-red-400   font-semibold">❌ Deployment failed</span>}
          {status === "rolled_back" && <span className="text-gray-400  font-semibold">↩ Rolled back</span>}
          {status === "queued"      && <span className="text-yellow-400 font-semibold">⏳ Position #{queuePosition} in queue</span>}
        </div>

      </div>
    </div>
  );
}