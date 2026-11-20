import { Monitor, CircleAlert, CheckCircle2 } from "lucide-react";
import styles from "./AgentStatus.module.css";

const AgentStatus = ({ status = "not-installed" }) => {
  const statusConfig = {
    "not-installed": {
      label: "Not Installed",
      description: "LAX Local Agent is not installed on this computer.",
      icon: CircleAlert,
    },
    installed: {
      label: "Installed",
      description: "LAX Local Agent is installed on this computer.",
      icon: CheckCircle2,
    },
    connected: {
      label: "Connected",
      description: "LAX Local Agent is running and connected.",
      icon: CheckCircle2,
    },
    offline: {
      label: "Offline",
      description: "LAX Local Agent is currently not connected.",
      icon: CircleAlert,
    },
  };

  const currentStatus = statusConfig[status] || statusConfig["not-installed"];
  const StatusIcon = currentStatus.icon;

  return (
    <section className={styles.statusCard}>
      <div className={styles.statusHeader}>
        <div className={styles.heading}>
          <div className={styles.iconBox}>
            <Monitor size={28} />
          </div>

          <h2>Agent Status</h2>
        </div>

        <span className={`${styles.badge} ${styles[status]}`}>
          <StatusIcon size={13} />
          {currentStatus.label}
        </span>
      </div>

      <p>{currentStatus.description}</p>
    </section>
  );
};

export default AgentStatus;