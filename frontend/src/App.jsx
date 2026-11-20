import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";

import { AuthProvider } from "./context/AuthContext";
import { DeviceProvider } from "./context/DeviceContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import MyDevices from "./pages/MyDevices/MyDevices";
import LocalAgent from "./pages/LocalAgent/LocalAgent";
import PairDevice from "./pages/PairDevice/PairDevice";
import Activity from "./pages/Activity/Activity";


function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        <DeviceProvider>

          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#151525",
                color: "#fff",
                border: "1px solid #7928ff",
                borderRadius: "10px",
                fontSize: "13px",
              },
              success: {
                iconTheme: {
                  primary: "#18d995",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ff5252",
                  secondary: "#fff",
                },
              },
            }}
          />
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
            </Route>

            {/* Private Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/devices" element={<MyDevices />} />
              <Route path="/local-agent" element={<LocalAgent />} />
              <Route path="/pair-device" element={<PairDevice />} />
              <Route path="/activity" element={<Activity />} />
            </Route>

          </Routes>
        </DeviceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;