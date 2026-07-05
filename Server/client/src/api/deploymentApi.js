import axios from "axios";

const API_URL =
"http://localhost:5000/api/deployments";

// ======================================
// Auth Header
// ======================================

const getAuthConfig = () => {
const token = localStorage.getItem("token");

return {
headers: {
Authorization: `Bearer ${token}`,
},
};
};

// ======================================
// Get All Deployments
// ======================================

export const getDeployments = async () => {
const response = await axios.get(
API_URL,
getAuthConfig()
);

return response.data;
};

// ======================================
// Get Single Deployment
// ======================================

export const getDeploymentById = async (id) => {
const response = await axios.get(
`${API_URL}/${id}`,
getAuthConfig()
);

return response.data;
};

// ======================================
// Create Deployment
// ======================================

export const createDeployment = async (
projectId
) => {
const response = await axios.post(
API_URL,
{
projectId,
},
getAuthConfig()
);

return response.data;
};

// ======================================
// Delete Deployment
// ======================================

export const deleteDeployment = async (
id
) => {
const response = await axios.delete(
`${API_URL}/${id}`,
getAuthConfig()
);

return response.data;
};

// ======================================
// Rollback Deployment
// ======================================

export const rollbackDeployment = async (
id
) => {
const response = await axios.post(
`${API_URL}/${id}/rollback`,
{},
getAuthConfig()
);

return response.data;
};
