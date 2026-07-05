import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import clsx from 'clsx';

/* ───────────────── Nav Items ───────────────── */
const NAV_ITEMS = [
  { to: "/dashboard",             label: "Overview",    icon: "⚡" },
  { to: "/dashboard/projects",    label: "Projects",    icon: "📁" },
  { to: "/dashboard/deployments", label: "Deployments", icon: "🚀" },
  { to: "/dashboard/monitoring",  label: "Monitoring",  icon: "📊" },
  { to: "/dashboard/env-vars",    label: "Env Vars",    icon: "🔐" },
  { to: "/dashboard/admin",       label: "Admin",       icon: "👑" },
];

/* ───────────────── Sidebar ───────────────── */
const Sidebar = ({ collapsed, toggle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={clsx(
      'fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50',
      collapsed ? 'w-16' : 'w-60'
    )}
      style={{ background: "#0d1117", borderRight: "1px solid #1f2535" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4"
        style={{ borderBottom: "1px solid #1f2535" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "linear-gradient(135deg,#3b82f6,#6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "800", fontSize: "13px", color: "white", flexShrink: 0,
        }}>
          IQ
        </div>
        {!collapsed && (
          <span style={{ fontWeight: "700", fontSize: "16px", color: "#f1f5f9" }}>
            DeployIQ
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1" style={{ overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: collapsed ? "10px 12px" : "9px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "500",
              transition: "all 0.15s",
              justifyContent: collapsed ? "center" : "flex-start",
              background: isActive ? "rgba(59,130,246,0.12)" : "transparent",
              color: isActive ? "#60a5fa" : "#94a3b8",
              border: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
            })}
          >
            <span style={{ fontSize: "15px", flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3" style={{ borderTop: "1px solid #1f2535" }}>
        {!collapsed ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "700", color: "white", flexShrink: 0,
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#f1f5f9" }}>
                  {user?.name || "User"}
                </div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444", padding: "4px 8px", borderRadius: "6px",
                cursor: "pointer", fontSize: "11px", fontWeight: "600",
              }}
            >
              Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              width: "100%", background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444",
              padding: "6px", borderRadius: "6px", cursor: "pointer", fontSize: "13px",
            }}
          >
            ↩
          </button>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={toggle}
        style={{
          position: "absolute", right: "-12px", top: "72px",
          width: "24px", height: "24px", borderRadius: "50%",
          background: "#1e293b", border: "1px solid #334155",
          color: "#94a3b8", cursor: "pointer", fontSize: "11px",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}
      >
        {collapsed ? "›" : "‹"}
      </button>
    </aside>
  );
};

/* ───────────────── TopBar ───────────────── */
export const TopBar = ({ title, subtitle, actions }) => {
  return (
    <div
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px",
        background: "#0d1117",           // ✅ dark — was bg-white
        borderBottom: "1px solid #1f2535",
      }}
    >
      <div>
        {title && (
          <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#f1f5f9" }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#6b7280" }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>{actions}</div>
    </div>
  );
};

/* ───────────────── Layout ───────────────── */
const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d1117" }}>
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />
      <div
        style={{
          flex: 1,
          marginLeft: collapsed ? "64px" : "240px",
          transition: "margin-left 0.3s",
          minHeight: "100vh",
          background: "#0d1117",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;