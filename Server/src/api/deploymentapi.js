import axios from "axios";

// ✅ Use environment variable
const BASE_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/deployments`;

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Add token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("diq_token") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getDeployments = async () => {
  const response = await api.get("/");
  return response.data;
};

export const getDeploymentById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createDeployment = async (deploymentData) => {
  const response = await api.post("/", deploymentData);
  return response.data;
};

export const deleteDeployment = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export const rollbackDeployment = async (id) => {
  const response = await api.post(`/${id}/rollback`);
  return response.data;
};

export default {
  getDeployments,
  getDeploymentById,
  createDeployment,
  deleteDeployment,
  rollbackDeployment,
};