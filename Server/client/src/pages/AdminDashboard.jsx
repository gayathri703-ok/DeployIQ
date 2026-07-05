// client/src/pages/AdminDashboard.jsx
// NEW FILE — create in client/src/pages/

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color }) => {
  const colors = {
    blue:   "border-blue-800   bg-blue-900/20   text-blue-400",
    green:  "border-green-800  bg-green-900/20  text-green-400",
    purple: "border-purple-800 bg-purple-900/20 text-purple-400",
    orange: "border-orange-800 bg-orange-900/20 text-orange-400",
    red:    "border-red-800    bg-red-900/20    text-red-400",
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color] || colors.blue}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-gray-500">{sub}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm mt-1 opacity-80">{label}</p>
    </div>
  );
};

// ── Status Badge ───────────────────────────────────────────────
const Badge = ({ status }) => {
  const styles = {
    success:     "bg-green-900/40  text-green-400  border-green-800",
    failed:      "bg-red-900/40    text-red-400    border-red-800",
    running:     "bg-blue-900/40   text-blue-400   border-blue-800",
    queued:      "bg-yellow-900/40 text-yellow-400 border-yellow-800",
    rolled_back: "bg-gray-800      text-gray-400   border-gray-700",
    pending:     "bg-yellow-900/40 text-yellow-400 border-yellow-800",
    live:        "bg-green-900/40  text-green-400  border-green-800",
    idle:        "bg-gray-800      text-gray-400   border-gray-700",
    building:    "bg-blue-900/40   text-blue-400   border-blue-800",
    user:        "bg-gray-800      text-gray-400   border-gray-700",
    admin:       "bg-purple-900/40 text-purple-400 border-purple-800",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles[status] || styles.idle}`}>
      {status?.replace("_", " ")}
    </span>
  );
};

// ── Main Component ─────────────────────────────────────────────
export default function AdminDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tab,     setTab]     = useState("overview"); // overview | users | projects

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("diq_token") ||
        localStorage.getItem("token");

      const { data: res } = await axios.get(`${API}/api/admin/summary`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.success) {
        setData(res);
        setError(null);
      }
    } catch (err) {
      console.error("ADMIN FETCH ERROR:", err);
      setError("Could not load admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading admin data...</p>
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
          <p className="text-red-400 font-semibold mb-2">Admin Dashboard Unavailable</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchSummary}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, recentUsers, recentDeployments } = data;

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">System overview — all users, projects and deployments</p>
          </div>
          <button
            onClick={fetchSummary}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#1f2535] text-gray-400 hover:text-white hover:border-purple-500 transition"
          >
            ↻ Refresh
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon="👥" label="Total Users"       value={stats.users.total}                color="blue"   sub={`${stats.users.active} active`} />
          <StatCard icon="📁" label="Total Projects"    value={stats.projects.total}             color="purple" sub={`${stats.projects.status?.live || 0} live`} />
          <StatCard icon="🚀" label="Total Deployments" value={stats.deployments.total}          color="green"  sub="all time" />
          <StatCard icon="✅" label="Successful"        value={stats.deployments.success}        color="green"  sub={`${stats.deployments.successRate}% rate`} />
          <StatCard icon="❌" label="Failed"            value={stats.deployments.failed}         color="red"    sub="need review" />
        </div>

        {/* ── Success Rate Bar ── */}
        <div className="bg-[#13161e] border border-[#1f2535] rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-gray-300">Overall Success Rate</p>
            <p className="text-sm font-bold text-green-400">{stats.deployments.successRate}%</p>
          </div>
          <div className="w-full bg-[#1e293b] rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-700"
              style={{ width: `${stats.deployments.successRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>✅ {stats.deployments.success} successful</span>
            <span>❌ {stats.deployments.failed} failed</span>
            <span>📊 {stats.deployments.total} total</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 border-b border-[#1f2535] pb-0">
          {["overview", "users", "projects"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-all -mb-px ${
                tab === t
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        {tab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">

            {/* Recent Users */}
            <div className="bg-[#13161e] border border-[#1f2535] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1f2535]">
                <h2 className="font-semibold text-white text-sm">Recent Users</h2>
              </div>
              <div className="divide-y divide-[#1f2535]">
                {recentUsers.length === 0 ? (
                  <p className="p-5 text-gray-500 text-sm">No users found</p>
                ) : recentUsers.map((u) => (
                  <div key={u._id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.githubConnected && (
                        <span className="text-xs text-gray-500">⚡ GitHub</span>
                      )}
                      <Badge status={u.role} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Deployments */}
            <div className="bg-[#13161e] border border-[#1f2535] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1f2535]">
                <h2 className="font-semibold text-white text-sm">Recent Deployments</h2>
              </div>
              <div className="divide-y divide-[#1f2535]">
                {recentDeployments.length === 0 ? (
                  <p className="p-5 text-gray-500 text-sm">No deployments found</p>
                ) : recentDeployments.map((d) => (
                  <div key={d._id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-gray-300">#{d._id.slice(-8)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(d.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge status={d.status} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── Tab: Users ── */}
        {tab === "users" && (
          <div className="bg-[#13161e] border border-[#1f2535] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1f2535] flex justify-between">
              <h2 className="font-semibold text-white text-sm">All Users</h2>
              <span className="text-xs text-gray-500">{stats.users.total} total</span>
            </div>
            <div className="divide-y divide-[#1f2535]">
              {recentUsers.length === 0 ? (
                <p className="p-5 text-gray-500 text-sm">No users found</p>
              ) : recentUsers.map((u) => (
                <div key={u._id} className="px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-900/40 border border-purple-800 flex items-center justify-center text-purple-400 font-bold text-sm">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Joined {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {u.githubConnected && (
                      <span className="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full">
                        ⚡ GitHub
                      </span>
                    )}
                    <Badge status={u.isActive ? "live" : "failed"} />
                    <Badge status={u.role} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Projects ── */}
        {tab === "projects" && (
          <div className="bg-[#13161e] border border-[#1f2535] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1f2535] flex justify-between">
              <h2 className="font-semibold text-white text-sm">Project Status Breakdown</h2>
              <span className="text-xs text-gray-500">{stats.projects.total} total</span>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {["live", "idle", "building", "failed"].map((s) => (
                <div key={s} className="bg-[#1e293b] border border-[#2a3050] rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{stats.projects.status?.[s] || 0}</p>
                  <Badge status={s} />
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Deployment Status Breakdown</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["success", "failed", "running", "rolled_back"].map((s) => (
                  <div key={s} className="bg-[#1e293b] border border-[#2a3050] rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{stats.deployments.status?.[s] || 0}</p>
                    <Badge status={s} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}