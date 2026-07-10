import axios from "axios";

// ============================================
// Axios Instance
// ============================================

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// Request Interceptor
// ============================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("diq_token");

    console.log("AXIOS WORKING");
    console.log("TOKEN =", token);
    console.log("REQUEST URL =", config.url);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// Response Interceptor
// ============================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("diq_token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

// ============================================
// Auth APIs
// ============================================

export const authAPI = {
  login: (data) => api.post("/api/auth/login", data),
  register: (data) => api.post("/api/auth/register", data),
  me: () => api.get("/api/auth/me"),
};

export default api;