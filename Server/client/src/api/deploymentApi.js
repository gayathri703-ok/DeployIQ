import axios from "axios";

// ✅ Use environment variable
const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/deployments`;

const getAuthConfig = () => {
  const token =
    localStorage.getItem("diq_token") ||
    localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const getDeployments = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

export const getDeploymentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};

export const createDeployment = async (projectId) => {
  const response = await axios.post(API_URL, { projectId }, getAuthConfig());
  return response.data;
};

export const deleteDeployment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};

export const rollbackDeployment = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/rollback`, {}, getAuthConfig());
  return response.data;
};