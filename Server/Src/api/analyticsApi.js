import axios from "axios";

const API =
  "http://localhost:5000/api/analytics";

export const getAnalytics =
  async () => {
    const token =
      localStorage.getItem(
        "diq_token"
      );

    const response =
      await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response.data;
  };