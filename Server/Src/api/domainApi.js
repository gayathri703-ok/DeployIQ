import axios from "axios";

const API_URL = "http://localhost:5000/api/domains";

export const getDomains = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDomain = async (domainData) => {
  const response = await axios.post(API_URL, domainData);
  return response.data;
};

export const deleteDomain = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );
  return response.data;
};