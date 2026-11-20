import api from "./api";

export const authService = {
  // Register
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);

    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);

    return response.data;
  },

  // Get logged-in user
  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");

    return response.data;
  },

  // Get LAX Device Status
  getDeviceStatus: async () => {
    const response = await api.get("/api/auth/device-status");

    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/api/auth/logout");

    return response.data;
  },
};
