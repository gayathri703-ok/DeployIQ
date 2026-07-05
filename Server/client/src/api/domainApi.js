import axios from "axios";

const API =
  "http://localhost:5000/api/domains";

export const getDomains =
  async () => {
    const response =
      await axios.get(API);

    return response.data;
  };

export const createDomain =
  async (data) => {
    const response =
      await axios.post(
        API,
        data
      );

    return response.data;
  };

export const deleteDomain =
  async (id) => {
    const response =
      await axios.delete(
        `${API}/${id}`
      );

    return response.data;
  };