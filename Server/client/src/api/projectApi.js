import axios from "axios";

// ✅ Use environment variable — works in both local and production
const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/projects`;

// Get all projects
export const getProjects = async () => {
  try {
    const token = localStorage.getItem("diq_token");
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get Projects Error:", error);
    throw error;
  }
};

// Get single project
export const getProjectById = async (id) => {
  try {
    const token = localStorage.getItem("diq_token");
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get Project Error:", error);
    throw error;
  }
};

// Create project
export const createProject = async (projectData) => {
  try {
    const token = localStorage.getItem("diq_token");
    const response = await axios.post(API_URL, projectData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Create Project Error:", error);
    throw error;
  }
};

// Update project
export const updateProject = async (id, projectData) => {
  try {
    const token = localStorage.getItem("diq_token");
    const response = await axios.put(`${API_URL}/${id}`, projectData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Update Project Error:", error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (id) => {
  try {
    const token = localStorage.getItem("diq_token");
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Delete Project Error:", error);
    throw error;
  }
};