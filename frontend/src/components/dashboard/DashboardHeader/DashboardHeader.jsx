import { Bell } from "lucide-react";
import styles from "./DashboardHeader.module.css";

const DashboardHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.heading}>
        <h1>Dashboard</h1>
        <p>Manage your LAX devices and monitor activity in real-time.</p>
      </div>

      <button className={styles.notificationButton} aria-label="Notifications">
        <Bell size={20} />
        <span className={styles.notificationDot}></span>
      </button>
    </header>
  );
};

export default DashboardHeader;