import axios from "axios";

const API_URL =
  "http://localhost:5000/api/rollback";

export const rollbackDeployment =
  async (deploymentId) => {

    const response =
      await axios.post(
        `${API_URL}/${deploymentId}`
      );

    return response.data;
};