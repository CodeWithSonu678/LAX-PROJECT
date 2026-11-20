import { NavLink, Link, useNavigate } from "react-router";

import {
  LayoutDashboard,
  Cpu,
  Link as LinkIcon,
  Activity,
  Settings,
  CircleHelp,
  UserRound,
  Monitor,
  AlertCircle,
  RefreshCw,
  LogOut,
} from "lucide-react";

import laxLogo from "../../../assets/lax_logo.png";
import styles from "./Sidebar.module.css";

import { useDevice } from "../../../context/DeviceContext";
import  useAuthContext  from "../../../hooks/useAuthContext";


// Device paired hone par
const deviceMenuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Devices",
    path: "/devices",
    icon: Cpu,
  },
  {
    title: "Pair LAX Device",
    path: "/pair-device",
    icon: LinkIcon,
  },
  {
    title: "Local Agent",
    path: "/local-agent",
    icon: Monitor,
  },
  {
    title: "Activity Logs",
    path: "/activity",
    icon: Activity,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    path: "/support",
    icon: CircleHelp,
  },
];

// Device paired hone se pehle
const setupMenuItems = [
  {
    title: "Pair LAX Device",
    path: "/pair-device",
    icon: LinkIcon,
  },
  {
    title: "Local Agent",
    path: "/local-agent",
    icon: Monitor,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const { logout } = useAuthContext();

  const {
    isDevicePaired,
    deviceLoading,
    deviceError,
    refreshDeviceStatus,
  } = useDevice();

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Loading state
  if (deviceLoading) {
    return (
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logo}>
          <img src={laxLogo} alt="LAX" />
          <span>LAX</span>
        </Link>

        <div className={styles.loadingState}>
          <RefreshCw size={20} className={styles.spinner} />
          <span>Checking device status...</span>
        </div>
      </aside>
    );
  }

  // API error state
  if (deviceError) {
    return (
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logo}>
          <img src={laxLogo} alt="LAX" />
          <span>LAX</span>
        </Link>

        <div className={styles.errorState}>
          <AlertCircle size={20} />
          <p>Unable to load device status.</p>

          <button onClick={refreshDeviceStatus}>
            Retry
          </button>
        </div>
      </aside>
    );
  }

  const menuItems = isDevicePaired
    ? deviceMenuItems
    : setupMenuItems;

  return (
    <aside className={styles.sidebar}>

      {/* Logo */}
      <Link to="/" className={styles.logo}>
        <img src={laxLogo} alt="LAX" />
        <span>LAX</span>
      </Link>

      {/* Navigation */}
      <nav className={styles.navigation}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `${styles.navItem} ${
                  isActive ? styles.active : ""
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>

        {/* User Profile */}
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <UserRound size={25} />
          </div>

          <div className={styles.userInfo}>
            <h4>Sonu Yadav</h4>
            <span>Pro User</span>
          </div>
        </div>

        {/* Logout */}
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;