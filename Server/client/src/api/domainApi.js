import axios from "axios";

// ✅ Use environment variable
const API = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/domains`;

const getAuthConfig = () => {
  const token =
    localStorage.getItem("diq_token") ||
    localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const getDomains = async () => {
  const response = await axios.get(API, getAuthConfig());
  return response.data;
};

export const createDomain = async (data) => {
  const response = await axios.post(API, data, getAuthConfig());
  return response.data;
};

export const deleteDomain = async (id) => {
  const response = await axios.delete(`${API}/${id}`, getAuthConfig());
  return response.data;
};