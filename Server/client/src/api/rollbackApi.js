import axios from "axios";

// ✅ Use environment variable
const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/rollback`;

const getAuthConfig = () => {
  const token =
    localStorage.getItem("diq_token") ||
    localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const rollbackDeployment = async (deploymentId) => {
  const response = await axios.post(
    `${API_URL}/${deploymentId}`,
    {},
    getAuthConfig()
  );
  return response.data;
};