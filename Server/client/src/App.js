import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Auth Pages
import Login          from "./pages/auth/Login";
import Register       from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard Pages
import Dashboard    from "./pages/Dashboards/Dashboard";
import Projects     from "./pages/Dashboards/project";
import ProjectDetails from "./pages/Dashboards/ProjectDetails";
import Logs         from "./pages/Dashboards/Logs";
import CICDDashboard from "./pages/CICDDashboard";

// Deployment Pages
import DeploymentsPage     from "./pages/Deploymentpage";
import DeploymentDetails   from "./pages/DeploymentDetails";
import DeploymentAnalytics from "./pages/DeploymentAnalytics";
import DeploymentPipeline  from "./pages/DeploymentPipeline";

// Other Pages
import EnvVarsPage         from "./pages/EnvVarspage";
import DomainPage          from "./pages/domainPage";
import DockerDashboard     from "./pages/DockerDashboard";
import NginxPage           from "./pages/NginxPage";
import MonitoringDashboard from "./pages/moniteringDashboard"; // Day 19
import AdminDashboard      from "./pages/AdminDashboard";      // ✅ Day 22

// Protected Route
function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("diq_token") ||
    localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/"                element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* PROJECTS */}
        <Route path="/dashboard/projects"     element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/dashboard/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />

        {/* LOGS */}
        <Route path="/dashboard/logs/:projectId"      element={<ProtectedRoute><Logs /></ProtectedRoute>} />
        <Route path="/dashboard/deployments/:id/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />

        {/* DEPLOYMENTS */}
        <Route path="/dashboard/deployments"     element={<ProtectedRoute><DeploymentsPage /></ProtectedRoute>} />
        <Route path="/dashboard/deployments/:id" element={<ProtectedRoute><DeploymentDetails /></ProtectedRoute>} />

        {/* ANALYTICS & PIPELINE */}
        <Route path="/dashboard/deployment-analytics" element={<ProtectedRoute><DeploymentAnalytics /></ProtectedRoute>} />
        <Route path="/dashboard/pipeline"             element={<ProtectedRoute><DeploymentPipeline /></ProtectedRoute>} />
        <Route path="/dashboard/cicd"                 element={<ProtectedRoute><CICDDashboard /></ProtectedRoute>} />

        {/* OTHER */}
        <Route path="/dashboard/env-vars"   element={<ProtectedRoute><EnvVarsPage /></ProtectedRoute>} />
        <Route path="/dashboard/domains"    element={<ProtectedRoute><DomainPage /></ProtectedRoute>} />
        <Route path="/dashboard/docker"     element={<ProtectedRoute><DockerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/nginx"      element={<ProtectedRoute><NginxPage /></ProtectedRoute>} />

        {/* Day 19 — MONITORING */}
        <Route path="/dashboard/monitoring" element={<ProtectedRoute><MonitoringDashboard /></ProtectedRoute>} />

        {/* ✅ Day 22 — ADMIN */}
        <Route path="/dashboard/admin"      element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/dashboard/projects" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;