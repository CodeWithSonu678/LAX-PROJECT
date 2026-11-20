import Sidebar from "../../dashboard/Sidebar/Sidebar";
import styles from "./DashboardLayout.module.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;