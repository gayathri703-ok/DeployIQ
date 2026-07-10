import axios from "axios";

// ✅ Use environment variable
const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/env`;

const getAuthConfig = () => {
  const token =
    localStorage.getItem("diq_token") ||
    localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const getEnvVars = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}`, getAuthConfig());
  return response.data;
};

export const createEnvVar = async (projectId, key, value) => {
  const response = await axios.post(API_URL, { projectId, key, value }, getAuthConfig());
  return response.data;
};

export const deleteEnvVar = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};