import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import useAuthContext from "../hooks/useAuthContext";
import { authService } from "../services/authService";

const DeviceContext = createContext(null);

export const DeviceProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext();

  const [device, setDevice] = useState(null);
  const [isDevicePaired, setIsDevicePaired] = useState(false);
  const [deviceLoading, setDeviceLoading] = useState(true);
  const [deviceError, setDeviceError] = useState(null);

  // Fetch Device Status
  const fetchDeviceStatus = useCallback(async () => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      setDevice(null);
      setIsDevicePaired(false);
      setDeviceError(null);
      setDeviceLoading(false);
      return;
    }

    try {
      setDeviceLoading(true);
      setDeviceError(null);

      const response = await authService.getDeviceStatus();

      const result = response.data;

      setDevice(result.device);
      setIsDevicePaired(result.isDevicePaired);

    } catch (error) {
      console.error("Device Status Error:", error);

      setDevice(null);
      setIsDevicePaired(false);

      setDeviceError(
        error.response?.data?.message ||
        error.message ||
        "Unable to fetch device status."
      );

    } finally {
      setDeviceLoading(false);
    }
  }, [user, isAuthenticated, authLoading]);

  // Initial Device Status Check
  useEffect(() => {
    fetchDeviceStatus();
  }, [fetchDeviceStatus]);

  return (
    <DeviceContext.Provider
      value={{
        device,
        isDevicePaired,
        deviceLoading,
        deviceError,
        refreshDeviceStatus: fetchDeviceStatus,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

// Custom Hook
export const useDevice = () => {
  const context = useContext(DeviceContext);

  if (!context) {
    throw new Error("useDevice must be used inside DeviceProvider");
  }

  return context;
};