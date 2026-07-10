// ============================================
// Analytics API
// ============================================

import api from "./axios";

// ============================================
// Get Analytics Summary
// ============================================

export const getAnalytics = async () => {
  const response = await api.get("/api/analytics");
  return response.data;
};

// ============================================
// Get Deployment Analytics
// ============================================

export const getDeploymentAnalytics = async () => {
  const response = await api.get("/api/analytics/deployments");
  return response.data;
};

// ============================================
// Get Project Analytics
// ============================================

export const getProjectAnalytics = async () => {
  const response = await api.get("/api/analytics/projects");
  return response.data;
};

// ============================================
// Get User Analytics
// ============================================

export const getUserAnalytics = async () => {
  const response = await api.get("/api/analytics/users");
  return response.data;
};