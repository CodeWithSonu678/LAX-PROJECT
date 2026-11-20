import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check Current User
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.getCurrentUser();

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      return response;

    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);

      const message =
        error.response?.data?.message ||
        "Authentication failed";

      setError(message);

      return null;

    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (credentials) => {
    try {
      setError(null);

      const response = await authService.login(credentials);

      if (response.success) {
        await checkAuth();

        toast.success("Welcome back! Login successful.");
      }

      return response;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please try again.";

      setError(message);
      toast.error(message);

      throw error;
    }
  };

  // Register
  const register = async (userData) => {
    try {
      setError(null);

      const response = await authService.register(userData);

      if (response.success) {
        toast.success("Account created successfully!");
      }

      return response;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(message);
      toast.error(message);

      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);

      await authService.logout();

      toast.success("Logged out successfully.");

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Logout failed.";

      toast.error(message);

    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Initial Authentication Check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    loading,
    error,

    login,
    register,
    logout,
    checkAuth,
  };
};

export default useAuth;