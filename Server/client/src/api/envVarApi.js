import axios from "axios";

const API_URL = "http://localhost:5000/api/env";

// ======================================
// Get Env Vars By Project
// ======================================

export const getEnvVars = async (projectId) => {
  const response = await axios.get(
    `${API_URL}/${projectId}`
  );

  return response.data;
};

// ======================================
// Create Env Var
// ======================================

export const createEnvVar = async (
  projectId,
  key,
  value
) => {
  const response = await axios.post(
    API_URL,
    {
      projectId,
      key,
      value,
    }
  );

  return response.data;
};

// ======================================
// Delete Env Var
// ======================================

export const deleteEnvVar = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};