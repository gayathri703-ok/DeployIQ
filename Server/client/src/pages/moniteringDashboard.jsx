// client/src/pages/MonitoringDashboard.jsx
// NEW FILE — create this in client/src/pages/

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ── Helpers ────────────────────────────────────────────────────
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

// ── Gauge Ring ─────────────────────────────────────────────────
const GaugeRing = ({ percent, color, size = 120 }) => {
  const r         = 45;
  const circ      = 2 * Math.PI * r;
  const offset    = circ - (percent / 100) * circ;
  const colorMap  = {
    blue:   "#3b82f6",
    green:  "#22c55e",
    purple: "#a855f7",
    orange: "#f97316",
  };
  const stroke = colorMap[color] || "#3b82f6";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Background ring */}
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
      {/* Progress ring */}
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke={stroke}
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      {/* Percent text */}
      <text x="50" y="50" textAnchor="middle" dy="0.35em"
        fill="#f1f5f9" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">
        {percent}%
      </text>
    </svg>
  );
};

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ title, percent, used, total, unit, color, icon }) => {
  const colorClass = {
    blue:   "text-blue-400",
    green:  "text-green-400",
    purple: "text-purple-400",
    orange: "text-orange-400",
  }[color] || "text-blue-400";

  const barColor = {
    blue:   "bg-blue-500",
    green:  "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  }[color] || "bg-blue-500";

  return (
    <div className="bg-[#13161e] border border-[#1f2535] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{percent}%</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>

      {/* Bar */}
      <div className="w-full bg-[#1e293b] rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Used: <span className="text-gray-300">{used} {unit}</span></span>
        <span>Total: <span className="text-gray-300">{total} {unit}</span></span>
      </div>
    </div>
  );
};

// ── Container Badge ────────────────────────────────────────────
const StateBadge = ({ state }) => {
  const styles = {
    running: "bg-green-900/40 text-green-400 border-green-800",
    exited:  "bg-red-900/40   text-red-400   border-red-800",
    paused:  "bg-yellow-900/40 text-yellow-400 border-yellow-800",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles[state] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
      {state}
    </span>
  );
};

// ── Main Component ─────────────────────────────────────────────
export default function MonitoringDashboard() {
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing,  setRefreshing]  = useState(false);

  const fetchStats = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const token = localStorage.getItem("diq_token");

      const { data: res } = await axios.get(`${API}/api/monitoring/summary`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.success) {
        setData(res);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      console.error("MONITORING ERROR:", err);
      setError("Could not load monitoring data. Make sure the server is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load + auto-refresh every 5 seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(true), 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading system stats...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-8 max-w-md text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-red-400 font-semibold mb-2">Monitoring Unavailable</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => fetchStats()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { cpu, memory, disk, system, containers } = data;

  // CPU color based on usage
  const cpuColor = cpu.usage > 80 ? "orange" : cpu.usage > 50 ? "blue" : "green";

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Monitoring Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              {system.distro} · {system.arch} ·
              Uptime: <span className="text-gray-300">{formatUptime(system.uptime)}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-green-400 animate-pulse`} />
              <span className="text-xs text-gray-400">
                Live · refreshes every 5s
              </span>
            </div>

            {/* Manual refresh */}
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#1f2535] text-gray-400 hover:text-white hover:border-blue-500 transition"
            >
              {refreshing ? "↻ Refreshing..." : "↻ Refresh"}
            </button>

            {lastUpdated && (
              <span className="text-xs text-gray-600">
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* ── Gauges Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CPU Gauge */}
          <div className="bg-[#13161e] border border-[#1f2535] rounded-xl p-6 flex flex-col items-center gap-3">
            <p className="text-gray-400 text-sm self-start">CPU Usage</p>
            <GaugeRing percent={cpu.usage} color={cpuColor} size={140} />
            <p className="text-gray-500 text-xs">
              {cpu.usage > 80 ? "🔴 High load" : cpu.usage > 50 ? "🟡 Moderate" : "🟢 Normal"}
            </p>
          </div>

          {/* Memory Gauge */}
          <div className="bg-[#13161e] border border-[#1f2535] rounded-xl p-6 flex flex-col items-center gap-3">
            <p className="text-gray-400 text-sm self-start">Memory Usage</p>
            <GaugeRing percent={memory.percent} color="purple" size={140} />
            <p className="text-gray-500 text-xs">
              {memory.used} GB / {memory.total} GB
            </p>
          </div>

          {/* Disk Gauge */}
          <div className="bg-[#13161e] border border-[#1f2535] rounded-xl p-6 flex flex-col items-center gap-3">
            <p className="text-gray-400 text-sm self-start">Disk Usage</p>
            <GaugeRing percent={disk.percent} color="orange" size={140} />
            <p className="text-gray-500 text-xs">
              {disk.used} GB / {disk.total} GB
            </p>
          </div>

        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="CPU"
            percent={cpu.usage}
            used={cpu.usage}
            total={100}
            unit="%"
            color={cpuColor}
            icon="🖥️"
          />
          <StatCard
            title="Memory"
            percent={memory.percent}
            used={memory.used}
            total={memory.total}
            unit="GB"
            color="purple"
            icon="🧠"
          />
          <StatCard
            title="Disk"
            percent={disk.percent}
            used={disk.used}
            total={disk.total}
            unit="GB"
            color="orange"
            icon="💾"
          />
        </div>

        {/* ── Container Summary ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Containers",   value: containers.total,   color: "text-white"       },
            { label: "Running",            value: containers.running,  color: "text-green-400"   },
            { label: "Stopped",            value: containers.stopped,  color: "text-red-400"     },
          ].map((item) => (
            <div key={item.label} className="bg-[#13161e] border border-[#1f2535] rounded-xl p-5 text-center">
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-gray-400 text-sm mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* ── Container List ── */}
        <div className="bg-[#13161e] border border-[#1f2535] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1f2535] flex items-center justify-between">
            <h2 className="font-semibold text-white">Docker Containers</h2>
            <span className="text-xs text-gray-500">{containers.total} total</span>
          </div>

          {containers.containers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-2xl mb-2">🐳</p>
              <p className="text-sm">No containers found</p>
              <p className="text-xs mt-1">Docker may not be running or no containers exist yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1f2535]">
              {containers.containers.map((c) => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.state === "running" ? "bg-green-400" : "bg-gray-600"}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{c.image} · {c.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">{c.status}</p>
                    <StateBadge state={c.state} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}